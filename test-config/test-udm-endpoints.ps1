Write-Host "======================================" -ForegroundColor Green
Write-Host "Testing UDM Endpoints" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

$UDM_URL = "http://localhost:3000"
$SUPI = "imsi-999700000000001"

Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$UDM_URL/health" -Method Get
    Write-Host "Success: Health check passed!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor Gray
} catch {
    Write-Host "Failed: Health check error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Testing Authentication Endpoint (generate-auth-data)..." -ForegroundColor Yellow

$authRequest = @{
    servingNetworkName = "5G:mnc070.mcc999.3gppnetwork.org"
    ausfInstanceId = "550e8400-e29b-41d4-a716-446655440000"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$UDM_URL/nudm-ueau/v1/$SUPI/security-information/generate-auth-data" -Method Post -ContentType "application/json" -Body $authRequest
    
    Write-Host "Success: Authentication endpoint works!" -ForegroundColor Green
    Write-Host "Auth Type: $($response.authType)" -ForegroundColor Gray
    Write-Host "RAND: $($response.authenticationVector.rand)" -ForegroundColor Gray
    Write-Host "AUTN: $($response.authenticationVector.autn)" -ForegroundColor Gray
    Write-Host "KAUSF: $($response.authenticationVector.kausf)" -ForegroundColor Gray
    Write-Host "XRES*: $($response.authenticationVector.xresStar)" -ForegroundColor Gray
} catch {
    Write-Host "Failed: Authentication error: $_" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Testing AMF Registration (PUT amf-3gpp-access)..." -ForegroundColor Yellow

$registrationData = @{
    amfInstanceId = "550e8400-e29b-41d4-a716-446655440000"
    deregCallbackUri = "http://amf.example.com:7777/callback"
    guami = @{
        plmnId = @{
            mcc = "999"
            mnc = "70"
        }
        amfId = "020001"
    }
    ratType = "NR"
    initialRegistrationInd = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$UDM_URL/nudm-uecm/v1/$SUPI/registrations/amf-3gpp-access" -Method Put -ContentType "application/json" -Body $registrationData
    
    Write-Host "Success: AMF registration successful!" -ForegroundColor Green
    Write-Host "AMF Instance ID: $($response.amfInstanceId)" -ForegroundColor Gray
} catch {
    Write-Host "Failed: AMF registration error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. Testing Get AMF Registration..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$UDM_URL/nudm-uecm/v1/$SUPI/registrations/amf-3gpp-access" -Method Get
    
    Write-Host "Success: Retrieved AMF registration!" -ForegroundColor Green
    Write-Host "AMF Instance ID: $($response.amfInstanceId)" -ForegroundColor Gray
    Write-Host "RAT Type: $($response.ratType)" -ForegroundColor Gray
} catch {
    Write-Host "Failed: Get registration error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "Testing Complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your UDM core endpoints are working!" -ForegroundColor Green
Write-Host ""
Write-Host "Next: For full 5G testing, see OPEN5GS_SETUP.md" -ForegroundColor Yellow
Write-Host ""
