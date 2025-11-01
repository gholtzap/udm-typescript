Write-Host "======================================" -ForegroundColor Green
Write-Host "Starting 5G Core with Custom UDM" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

Write-Host "Starting all services..." -ForegroundColor Yellow
Write-Host "(This may take a minute...)" -ForegroundColor Gray
Write-Host ""

docker compose -f sa-deploy.yaml up -d

Write-Host ""
Write-Host "Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "5G Core Started!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

Write-Host "Check status:" -ForegroundColor Yellow
Write-Host "  docker compose -f sa-deploy.yaml ps" -ForegroundColor Cyan
Write-Host ""

Write-Host "Monitor your custom UDM:" -ForegroundColor Yellow
Write-Host "  docker compose -f sa-deploy.yaml logs -f custom-udm" -ForegroundColor Cyan
Write-Host ""

Write-Host "Check UE registration:" -ForegroundColor Yellow
Write-Host "  docker compose -f sa-deploy.yaml logs nr-ue" -ForegroundColor Cyan
Write-Host ""

Write-Host "Test connectivity from UE:" -ForegroundColor Yellow
Write-Host "  docker compose -f sa-deploy.yaml exec nr-ue ping -I uesimtun0 8.8.8.8" -ForegroundColor Cyan
Write-Host ""

Write-Host "Stop everything:" -ForegroundColor Yellow
Write-Host "  docker compose -f sa-deploy.yaml down" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking container status..." -ForegroundColor Yellow
docker compose -f sa-deploy.yaml ps

Write-Host ""
Write-Host "If you see 'custom-udm' running above, your UDM is live!" -ForegroundColor Green
Write-Host "Monitor it with: docker compose -f sa-deploy.yaml logs -f custom-udm" -ForegroundColor Yellow
Write-Host ""

