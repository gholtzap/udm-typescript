Write-Host "======================================" -ForegroundColor Green
Write-Host "Provisioning Test Subscriber" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

Write-Host "Starting MongoDB..." -ForegroundColor Yellow
docker compose -f sa-deploy.yaml up -d mongo

Write-Host "Waiting for MongoDB to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Adding test subscriber to MongoDB..." -ForegroundColor Yellow

$subscriberData = @'
db.subscribers.deleteMany({supi: 'imsi-999700000000001'});
db.subscribers.insertOne({
  supi: 'imsi-999700000000001',
  permanentKey: '465B5CE8B199B49FAA5F0A2EE238A6BC',
  operatorKey: 'E8ED289DEBA952E4283B54E88E6183CA',
  sequenceNumber: '000000000001',
  authenticationMethod: '5G_AKA',
  subscribedData: {
    authenticationSubscription: {
      authenticationMethod: '5G_AKA',
      permanentKey: { 
        permanentKeyValue: '465B5CE8B199B49FAA5F0A2EE238A6BC' 
      },
      sequenceNumber: '000000000001',
      authenticationManagementField: '8000',
      milenage: { 
        op: { 
          opValue: 'E8ED289DEBA952E4283B54E88E6183CA' 
        } 
      }
    },
    amData: {
      gpsis: ['msisdn-1234567890'],
      subscribedUeAmbr: { 
        uplink: '1 Gbps', 
        downlink: '2 Gbps' 
      },
      nssai: { 
        defaultSingleNssais: [
          { sst: 1 }
        ] 
      }
    },
    smData: [
      {
        singleNssai: { sst: 1 },
        dnnConfigurations: {
          internet: {
            pduSessionTypes: { 
              defaultSessionType: 'IPV4' 
            },
            sscModes: { 
              defaultSscMode: 'SSC_MODE_1' 
            },
            '5gQosProfile': { 
              '5qi': 9, 
              arp: { priorityLevel: 8 } 
            },
            sessionAmbr: {
              uplink: '1 Gbps',
              downlink: '2 Gbps'
            }
          }
        }
      }
    ]
  }
});
print('Test subscriber provisioned successfully!');
'@

docker compose -f sa-deploy.yaml exec -T mongo mongosh udm --eval $subscriberData

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "Subscriber Provisioned!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Subscriber Details:" -ForegroundColor Yellow
Write-Host "  SUPI: imsi-999700000000001" -ForegroundColor White
Write-Host "  K:    465B5CE8B199B49FAA5F0A2EE238A6BC" -ForegroundColor White
Write-Host "  OPc:  E8ED289DEBA952E4283B54E88E6183CA" -ForegroundColor White
Write-Host ""
Write-Host "Next: Run 'npm run 5g:start' to start the 5G core" -ForegroundColor Yellow
Write-Host ""

