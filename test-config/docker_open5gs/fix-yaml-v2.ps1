Write-Host "Fixing sa-deploy.yaml (v2)..." -ForegroundColor Yellow

# Restore from backup
Copy-Item "sa-deploy.yaml.backup" "sa-deploy.yaml" -Force
Write-Host "Restored from backup" -ForegroundColor Green

# Read all lines
$lines = Get-Content "sa-deploy.yaml"
$output = @()
$skipUdmService = $false
$indentLevel = 0

for ($i = 0; $i < $lines.Count; $i++) {
    $line = $lines[$i]
    
    # Check if this is the udm service definition
    if ($line -match '^\s*udm:\s*$') {
        Write-Host "Found udm service at line $($i + 1), replacing with custom-udm..." -ForegroundColor Cyan
        
        # Add custom-udm service instead
        $output += "  custom-udm:"
        $output += "    build:"
        $output += "      context: ../../"
        $output += "      dockerfile: Dockerfile"
        $output += "    container_name: custom-udm"
        $output += "    depends_on:"
        $output += "      - mongo"
        $output += "    environment:"
        $output += "      - PORT=3000"
        $output += "      - MONGODB_URI=mongodb://mongo:27017/udm"
        $output += "      - NODE_ENV=production"
        $output += "    expose:"
        $output += "      - `"3000`""
        $output += "    networks:"
        $output += "      default:"
        $output += "        ipv4_address: `${UDM_IP}"
        $output += "    volumes:"
        $output += "      - ../../src:/app/src"
        $output += "      - ../../package.json:/app/package.json"
        $output += "      - ../../tsconfig.json:/app/tsconfig.json"
        $output += "    command: npm run dev"
        
        $skipUdmService = $true
        continue
    }
    
    # Skip lines that are part of the old udm service
    if ($skipUdmService) {
        # Check if we've reached the next service (starts with 2 spaces and a word followed by colon)
        if ($line -match '^\s\s\w+:\s*$' -and $line -notmatch '^\s{4,}') {
            $skipUdmService = $false
            # Don't skip this line, it's the next service
        } else {
            # Skip this line as it's part of the old udm service
            continue
        }
    }
    
    # Add the line to output
    $output += $line
}

# Write the fixed file
$output | Set-Content "sa-deploy.yaml"

Write-Host "Fixed sa-deploy.yaml successfully!" -ForegroundColor Green
Write-Host "The default 'udm' service has been completely replaced with 'custom-udm'" -ForegroundColor Cyan
Write-Host ""


