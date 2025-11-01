#!/usr/bin/env pwsh
# 5G SA Test Environment - Complete Verification Script
# This script starts the entire 5G core network and runs comprehensive tests

$ErrorActionPreference = "Continue"

function Write-Step {
    param([string]$Message)
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Write-Failure {
    param([string]$Message)
    Write-Host "[FAIL] $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Yellow
}

function Test-ContainerRunning {
    param([string]$ContainerName)
    $status = docker inspect -f '{{.State.Running}}' $ContainerName 2>$null
    return $status -eq "true"
}

function Test-ContainerEpollIssue {
    param([string]$ContainerName)
    $logs = docker logs $ContainerName 2>&1 | Select-String "epoll_create"
    return $null -ne $logs
}

function Wait-ForService {
    param(
        [string]$ServiceName,
        [string]$ContainerName,
        [int]$MaxAttempts = 30,
        [int]$SleepSeconds = 2,
        [switch]$AllowRestarts
    )

    Write-Info "Waiting for $ServiceName to be ready..."
    $successCount = 0
    $epollWarned = $false

    for ($i = 1; $i -le $MaxAttempts; $i++) {
        if (Test-ContainerRunning $ContainerName) {
            $successCount++
            if ($successCount -ge 2) {
                Write-Success "$ServiceName is running"
                return $true
            }
        } else {
            # Check if container has epoll issue
            if ((Test-ContainerEpollIssue $ContainerName) -and !$epollWarned) {
                Write-Info "$ServiceName experiencing WSL2 epoll compatibility issue - will auto-restart"
                $epollWarned = $true
            }
            $successCount = 0
        }
        Start-Sleep -Seconds $SleepSeconds
    }

    # Final check - if it's running now, that's good enough
    if (Test-ContainerRunning $ContainerName) {
        Write-Success "$ServiceName is running (may restart periodically due to WSL2 issue)"
        return $true
    }

    Write-Failure "$ServiceName failed to start"
    return $false
}

function Test-HttpEndpoint {
    param(
        [string]$Url,
        [string]$Description
    )

    try {
        $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Success "$Description responded with 200 OK"
            return $true
        }
    } catch {
        Write-Failure "$Description is not responding"
        return $false
    }
}

# Banner
Write-Host @"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     5G SA Test Environment Verification Script           ║
║     Custom UDM Integration Testing                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
"@ -ForegroundColor Magenta

# Step 1: Clean up existing environment
Write-Step "Step 1: Cleaning up existing environment"
docker-compose -f docker-compose.test.yml down -v 2>$null
Write-Success "Environment cleaned"

# Step 2: Start core infrastructure
Write-Step "Step 2: Starting core infrastructure (MongoDB, NRF, UDR)"
docker-compose -f docker-compose.test.yml up -d mongodb open5gs-nrf open5gs-udr
Start-Sleep -Seconds 5

if (!(Wait-ForService "MongoDB" "udm-mongodb")) {
    Write-Failure "MongoDB failed to start. Exiting."
    exit 1
}

if (!(Wait-ForService "NRF" "open5gs-nrf")) {
    Write-Failure "NRF failed to start. Exiting."
    exit 1
}

if (!(Wait-ForService "UDR" "open5gs-udr")) {
    Write-Failure "UDR failed to start. Exiting."
    exit 1
}

# Step 3: Initialize test subscriber
Write-Step "Step 3: Initializing test subscriber in MongoDB"
Start-Sleep -Seconds 3

docker-compose -f docker-compose.test.yml exec -T mongodb mongosh udm --eval @"
db.subscribers.deleteMany({});
db.subscribers.insertOne({
  'supi': 'imsi-999700000000001',
  'permanentKey': '465B5CE8B199B49FAA5F0A2EE238A6BC',
  'operatorKey': 'E8ED289DEBA952E4283B54E88E6183CA',
  'sequenceNumber': '16F3B3F70FC2',
  'authenticationMethod': '5G_AKA'
});
"@ | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Success "Test subscriber initialized (SUPI: imsi-999700000000001)"
} else {
    Write-Failure "Failed to initialize subscriber"
    exit 1
}

# Step 4: Start custom UDM
Write-Step "Step 4: Starting custom UDM"
docker-compose -f docker-compose.test.yml up -d custom-udm
Start-Sleep -Seconds 5

if (!(Wait-ForService "Custom UDM" "custom-udm")) {
    Write-Failure "Custom UDM failed to start. Exiting."
    exit 1
}

# Step 5: Test custom UDM endpoints
Write-Step "Step 5: Testing custom UDM endpoints"
Start-Sleep -Seconds 3

$udmTests = @(
    @{
        Url = "http://localhost:3000/nudm-sdm/v2/imsi-999700000000001/am-data"
        Description = "UDM AM Data endpoint"
    },
    @{
        Url = "http://localhost:3000/nudm-sdm/v2/imsi-999700000000001/smf-select-data"
        Description = "UDM SMF Selection Data endpoint"
    },
    @{
        Url = "http://localhost:3000/nudm-sdm/v2/imsi-999700000000001/sm-data"
        Description = "UDM Session Management Data endpoint"
    }
)

$udmSuccess = $true
foreach ($test in $udmTests) {
    if (!(Test-HttpEndpoint -Url $test.Url -Description $test.Description)) {
        $udmSuccess = $false
    }
}

if (!$udmSuccess) {
    Write-Failure "Custom UDM is not responding correctly. Check logs with: docker-compose -f docker-compose.test.yml logs custom-udm"
    exit 1
}

# Step 6: Start 5G Core Network Functions
Write-Step "Step 6: Starting 5G Core Network Functions (AUSF, AMF, SMF, UPF, PCF, BSF)"
docker-compose -f docker-compose.test.yml up -d open5gs-ausf open5gs-amf open5gs-smf open5gs-upf open5gs-pcf open5gs-bsf
Start-Sleep -Seconds 8

$coreNFs = @(
    @{Name = "AUSF"; Container = "open5gs-ausf"},
    @{Name = "AMF"; Container = "open5gs-amf"},
    @{Name = "SMF"; Container = "open5gs-smf"},
    @{Name = "UPF"; Container = "open5gs-upf"},
    @{Name = "PCF"; Container = "open5gs-pcf"},
    @{Name = "BSF"; Container = "open5gs-bsf"}
)

$allNFsRunning = $true
foreach ($nf in $coreNFs) {
    if (Test-ContainerRunning $nf.Container) {
        Write-Success "$($nf.Name) is running"
    } else {
        Write-Failure "$($nf.Name) is not running"
        $allNFsRunning = $false
    }
}

if (!$allNFsRunning) {
    Write-Info "Some network functions are not running, but continuing..."
}

# Step 7: Start RAN simulator (gNB)
Write-Step "Step 7: Starting RAN simulator (gNB)"
docker-compose -f docker-compose.test.yml up -d ueransim-gnb
Start-Sleep -Seconds 5

if (!(Wait-ForService "gNB" "ueransim-gnb")) {
    Write-Failure "gNB failed to start. Exiting."
    exit 1
}

# Step 8: Check gNB connection to AMF
Write-Step "Step 8: Verifying gNB connection to AMF"
Start-Sleep -Seconds 3

$gnbLogs = docker logs ueransim-gnb 2>&1 | Select-String "NG Setup procedure is successful"
if ($gnbLogs) {
    Write-Success "gNB successfully connected to AMF"
} else {
    Write-Info "Checking gNB logs for connection status..."
    $gnbError = docker logs ueransim-gnb 2>&1 | Select-String "error|fail" -CaseSensitive
    if ($gnbError) {
        Write-Failure "gNB connection issues detected"
        Write-Info "Recent gNB logs:"
        docker logs --tail 20 ueransim-gnb 2>&1
    } else {
        Write-Info "gNB may still be connecting..."
    }
}

# Step 9: Start UE simulator
Write-Step "Step 9: Starting UE simulator"
docker-compose -f docker-compose.test.yml up -d ueransim-ue
Start-Sleep -Seconds 5

if (!(Wait-ForService "UE" "ueransim-ue")) {
    Write-Failure "UE failed to start. Exiting."
    exit 1
}

# Step 10: Verify UE registration
Write-Step "Step 10: Verifying UE registration"
Start-Sleep -Seconds 5

$ueRegLogs = docker logs ueransim-ue 2>&1 | Select-String "Registration successful|PDU Session establishment"
if ($ueRegLogs) {
    Write-Success "UE successfully registered to 5G network"
} else {
    Write-Info "Checking UE registration status..."
    $ueError = docker logs ueransim-ue 2>&1 | Select-String "error|fail|reject" -CaseSensitive
    if ($ueError) {
        Write-Failure "UE registration failed"
        Write-Info "Recent UE logs:"
        docker logs --tail 30 ueransim-ue 2>&1
    } else {
        Write-Info "UE may still be registering..."
    }
}

# Step 11: Test end-to-end connectivity
Write-Step "Step 11: Testing end-to-end connectivity (UE -> Internet)"
Write-Info "Attempting to ping 8.8.8.8 from UE..."
Start-Sleep -Seconds 3

$pingResult = docker-compose -f docker-compose.test.yml exec -T ueransim-ue ping -c 4 8.8.8.8 2>&1
$pingSuccess = $pingResult -match "4 packets transmitted, 4 received"

if ($pingSuccess) {
    Write-Success "End-to-end connectivity SUCCESSFUL!"
    Write-Success "UE can reach the internet through the 5G core network"
    Write-Host "`nPing results:" -ForegroundColor Cyan
    Write-Host $pingResult
} else {
    Write-Failure "End-to-end connectivity test failed"
    Write-Info "Ping output:"
    Write-Host $pingResult
}

# Step 12: Summary and next steps
Write-Step "Test Summary"

Write-Host "`n5G SA Test Environment Status:" -ForegroundColor White
Write-Host "================================" -ForegroundColor White

$summary = @{
    "MongoDB" = Test-ContainerRunning "udm-mongodb"
    "NRF (Service Discovery)" = Test-ContainerRunning "open5gs-nrf"
    "UDR (Data Repository)" = Test-ContainerRunning "open5gs-udr"
    "Custom UDM" = Test-ContainerRunning "custom-udm"
    "AUSF (Authentication)" = Test-ContainerRunning "open5gs-ausf"
    "AMF (Access/Mobility)" = Test-ContainerRunning "open5gs-amf"
    "SMF (Session Management)" = Test-ContainerRunning "open5gs-smf"
    "UPF (User Plane)" = Test-ContainerRunning "open5gs-upf"
    "PCF (Policy Control)" = Test-ContainerRunning "open5gs-pcf"
    "BSF (Binding Support)" = Test-ContainerRunning "open5gs-bsf"
    "gNB (Base Station)" = Test-ContainerRunning "ueransim-gnb"
    "UE (Phone Simulator)" = Test-ContainerRunning "ueransim-ue"
}

foreach ($service in $summary.GetEnumerator()) {
    if ($service.Value) {
        Write-Host "  $($service.Key): " -NoNewline
        Write-Host "RUNNING" -ForegroundColor Green
    } else {
        Write-Host "  $($service.Key): " -NoNewline
        Write-Host "STOPPED" -ForegroundColor Red
    }
}

Write-Host "`nEnd-to-End Test: " -NoNewline
if ($pingSuccess) {
    Write-Host "PASSED" -ForegroundColor Green
} else {
    Write-Host "FAILED" -ForegroundColor Red
}

Write-Host "`n" -NoNewline
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
if ($pingSuccess) {
    Write-Host "║  " -NoNewline -ForegroundColor Magenta
    Write-Host "✓ 5G SA Test Environment is FULLY OPERATIONAL         " -NoNewline -ForegroundColor Green
    Write-Host "║" -ForegroundColor Magenta
} else {
    Write-Host "║  " -NoNewline -ForegroundColor Magenta
    Write-Host "⚠ 5G SA Test Environment has issues                   " -NoNewline -ForegroundColor Yellow
    Write-Host "║" -ForegroundColor Magenta
}
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Magenta

Write-Host "`nUseful Commands:" -ForegroundColor White
Write-Host "───────────────" -ForegroundColor White
Write-Host "  Monitor UDM logs:       " -NoNewline
Write-Host "docker-compose -f docker-compose.test.yml logs -f custom-udm" -ForegroundColor Cyan
Write-Host "  Monitor AMF logs:       " -NoNewline
Write-Host "docker-compose -f docker-compose.test.yml logs -f open5gs-amf" -ForegroundColor Cyan
Write-Host "  Monitor UE logs:        " -NoNewline
Write-Host "docker-compose -f docker-compose.test.yml logs -f ueransim-ue" -ForegroundColor Cyan
Write-Host "  Test connectivity:      " -NoNewline
Write-Host "docker-compose -f docker-compose.test.yml exec ueransim-ue ping 8.8.8.8" -ForegroundColor Cyan
Write-Host "  Stop environment:       " -NoNewline
Write-Host "docker-compose -f docker-compose.test.yml down" -ForegroundColor Cyan
Write-Host "  Test UDM endpoint:      " -NoNewline
Write-Host "curl http://localhost:3000/nudm-sdm/v2/imsi-999700000000001/am-data" -ForegroundColor Cyan

Write-Host "`nTest subscriber details:" -ForegroundColor White
Write-Host "  SUPI: imsi-999700000000001"
Write-Host "  PLMN: MCC=999, MNC=70"
Write-Host "  Network Slice: SST=1, SD=0x010203"
Write-Host ""

if ($pingSuccess) {
    exit 0
} else {
    Write-Host "Note: Some tests failed. Check the logs for more details." -ForegroundColor Yellow
    exit 1
}
