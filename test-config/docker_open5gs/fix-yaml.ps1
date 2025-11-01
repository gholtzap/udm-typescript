Write-Host "Fixing sa-deploy.yaml..." -ForegroundColor Yellow

# Restore from backup
Copy-Item "sa-deploy.yaml.backup" "sa-deploy.yaml" -Force
Write-Host "Restored from backup" -ForegroundColor Green

# Read the file
$content = Get-Content "sa-deploy.yaml" -Raw

# Find and replace the udm service with custom-udm
$pattern = '(?ms)^  udm:.*?(?=^  \w+:|$)'
$replacement = @'
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
        ipv4_address: ${UDM_IP}
    volumes:
      - ../../src:/app/src
      - ../../package.json:/app/package.json
      - ../../tsconfig.json:/app/tsconfig.json
    command: npm run dev
'@

$content = $content -replace $pattern, $replacement

# Save the file
Set-Content "sa-deploy.yaml" $content

Write-Host "Fixed sa-deploy.yaml successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "The default 'udm' service has been replaced with 'custom-udm'" -ForegroundColor Cyan


