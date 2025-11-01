const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'udm';

const testSubscriber = {
  supi: 'imsi-999700000000001',
  permanentKey: '465B5CE8B199B49FAA5F0A2EE238A6BC',
  operatorKey: 'E8ED289DEBA952E4283B54E88E6183CA',
  sequenceNumber: '16F3B3F70FC2',
  authenticationMethod: '5G_AKA',
  subscribedData: {
    amData: {
      gpsis: ['msisdn-1234567890'],
      subscribedUeAmbr: {
        uplink: '1 Gbps',
        downlink: '2 Gbps'
      },
      nssai: {
        defaultSingleNssais: [
          {
            sst: 1,
            sd: '010203'
          }
        ]
      }
    },
    smfSelectionData: {
      subscribedSnssaiInfos: {
        '01010203': {
          dnnInfos: [
            {
              dnn: 'internet'
            }
          ]
        }
      }
    },
    smData: [
      {
        singleNssai: {
          sst: 1,
          sd: '010203'
        },
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
              arp: {
                priorityLevel: 8
              },
              priorityLevel: 8
            },
            sessionAmbr: {
              uplink: '1 Gbps',
              downlink: '2 Gbps'
            }
          }
        }
      }
    ],
    authenticationSubscription: {
      authenticationMethod: '5G_AKA',
      permanentKey: {
        permanentKeyValue: '465B5CE8B199B49FAA5F0A2EE238A6BC'
      },
      sequenceNumber: '16F3B3F70FC2',
      authenticationManagementField: '8000',
      milenage: {
        op: {
          opValue: 'E8ED289DEBA952E4283B54E88E6183CA'
        }
      }
    }
  }
};

async function initSubscriber() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const collection = db.collection('subscribers');
    
    const existing = await collection.findOne({ supi: testSubscriber.supi });
    
    if (existing) {
      console.log('Test subscriber already exists, updating...');
      await collection.replaceOne(
        { supi: testSubscriber.supi },
        testSubscriber
      );
    } else {
      console.log('Creating test subscriber...');
      await collection.insertOne(testSubscriber);
    }
    
    console.log('Test subscriber initialized successfully');
    console.log(`SUPI: ${testSubscriber.supi}`);
    console.log(`Key: ${testSubscriber.permanentKey}`);
    console.log(`OPc: ${testSubscriber.operatorKey}`);
    
  } catch (error) {
    console.error('Error initializing subscriber:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

initSubscriber();


