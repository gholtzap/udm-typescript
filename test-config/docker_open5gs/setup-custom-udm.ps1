Write-Host "======================================" -ForegroundColor Green
Write-Host "Setting Up docker_open5gs with Custom UDM" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

$ErrorActionPreference = "Stop"

Write-Host "Step 1: Backing up original files..." -ForegroundColor Yellow
if (Test-Path "sa-deploy.yaml.backup") {
    Write-Host "Backup already exists, skipping..." -ForegroundColor Gray
} else {
    Copy-Item "sa-deploy.yaml" "sa-deploy.yaml.backup"
    Write-Host "Created sa-deploy.yaml.backup" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Copying custom environment configuration..." -ForegroundColor Yellow
Copy-Item ".env.custom" ".env" -Force
Write-Host "Created .env with custom settings" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Modifying AUSF configuration..." -ForegroundColor Yellow
$ausfInit = Get-Content "ausf/ausf_init.sh" -Raw
$ausfInit = $ausfInit -replace 'udm:\s*-\s*uri:\s*http://[^\s]+', "udm:`n      - uri: http://`${UDM_IP}:3000"
Set-Content "ausf/ausf_init.sh" $ausfInit
Write-Host "Updated ausf/ausf_init.sh to point to custom UDM" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Modifying AMF configuration..." -ForegroundColor Yellow
$amfInit = Get-Content "amf/amf_init.sh" -Raw
$amfInit = $amfInit -replace 'udm:\s*-\s*uri:\s*http://[^\s]+', "udm:`n      - uri: http://`${UDM_IP}:3000"
Set-Content "amf/amf_init.sh" $amfInit
Write-Host "Updated amf/amf_init.sh to point to custom UDM" -ForegroundColor Green

Write-Host ""
Write-Host "Step 5: Modifying SMF configuration..." -ForegroundColor Yellow
$smfInit = Get-Content "smf/smf_init.sh" -Raw
$smfInit = $smfInit -replace 'udm:\s*-\s*uri:\s*http://[^\s]+', "udm:`n      - uri: http://`${UDM_IP}:3000"
Set-Content "smf/smf_init.sh" $smfInit
Write-Host "Updated smf/smf_init.sh to point to custom UDM" -ForegroundColor Green

Write-Host ""
Write-Host "Step 6: Modifying sa-deploy.yaml..." -ForegroundColor Yellow

$saDeployContent = Get-Content "sa-deploy.yaml" -Raw

# Remove the default udm service
$pattern = '(?ms)^\s*udm:.*?(?=^\s*\w+:|$)'
$saDeployContent = $saDeployContent -replace $pattern, ''

# Add custom-udm service after mongo
$customUdmService = @"

  custom-udm:
    build:
      context: ../../
      dockerfile: Dockerfile
    container_name: custom-udm
    depends_on:
      - mongo
    environment:
      - PORT=3000
      - MONGODB_URI=mongodb://mongo:27017/udm
      - NODE_ENV=production
    expose:
      - "3000"
    networks:
      default:
        ipv4_address: `${UDM_IP}
    volumes:
      - ../../src:/app/src
      - ../../package.json:/app/package.json
      - ../../tsconfig.json:/app/tsconfig.json
    command: npm run dev
"@

$saDeployContent = $saDeployContent -replace '(mongo:.*?networks:.*?default:.*?ipv4_address:.*?\$\{MONGO_IP\})', "`$1$customUdmService"

Set-Content "sa-deploy.yaml" $saDeployContent
Write-Host "Modified sa-deploy.yaml with custom UDM service" -ForegroundColor Green

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update DOCKER_HOST_IP in .env to your Windows IP" -ForegroundColor White
Write-Host "2. Run: npm run 5g:provision (to add subscriber)" -ForegroundColor White
Write-Host "3. Run: npm run 5g:start (to start everything)" -ForegroundColor White
Write-Host ""


