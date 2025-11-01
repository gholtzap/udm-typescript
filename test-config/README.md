# Test Configuration Files

This directory contains all configuration files needed to run the complete 5G test environment.

## Directory Structure

```
test-config/
├── open5gs/           # Configuration files for Open5GS network functions
│   ├── amf.yaml      # Access and Mobility Management Function
│   ├── ausf.yaml     # Authentication Server Function (points to your UDM)
│   ├── smf.yaml      # Session Management Function (points to your UDM)
│   ├── upf.yaml      # User Plane Function
│   ├── nrf.yaml      # Network Repository Function
│   ├── udr.yaml      # Unified Data Repository
│   ├── scp.yaml      # Service Communication Proxy
│   ├── pcf.yaml      # Policy Control Function
│   └── bsf.yaml      # Binding Support Function
│
├── ueransim/          # Configuration for UE and gNB simulators
│   ├── Dockerfile.ueransim
│   ├── gnb.yaml      # Base station (gNodeB) configuration
│   └── ue.yaml       # User Equipment configuration
│
├── init-subscriber.js # Script to initialize test subscriber in MongoDB
├── start-test-env.sh # Script to start the entire test environment
└── stop-test-env.sh  # Script to stop the test environment
```

## Key Configuration Details

### Network Addressing

All components are on the `10.100.200.0/24` network:

| Component | IP Address | Port |
|-----------|------------|------|
| Your Custom UDM | 10.100.200.10 | 3000 |
| NRF | 10.100.200.11 | 7777 |
| SCP | 10.100.200.12 | 7777 |
| UDR | 10.100.200.13 | 7777 |
| AUSF | 10.100.200.14 | 7777 |
| AMF | 10.100.200.15 | 7777 |
| SMF | 10.100.200.16 | 7777 |
| UPF | 10.100.200.17 | 8805 |
| PCF | 10.100.200.18 | 7777 |
| BSF | 10.100.200.19 | 7777 |
| gNB | 10.100.200.20 | - |
| UE | 10.100.200.21 | - |

### PLMN Configuration

- **MCC**: 999 (Test network)
- **MNC**: 70
- **TAC**: 1

### Test Subscriber

Configured in `ueransim/ue.yaml` and initialized by `init-subscriber.js`:

- **SUPI**: imsi-999700000000001
- **K**: 465B5CE8B199B49FAA5F0A2EE238A6BC
- **OPc**: E8ED289DEBA952E4283B54E88E6183CA
- **DNN**: internet
- **Slice**: SST=1, SD=010203

## Customization

### Adding More Subscribers

Edit `init-subscriber.js` or manually insert into MongoDB:

```javascript
db.subscribers.insertOne({
  "supi": "imsi-999700000000002",
  "permanentKey": "YOUR_KEY_HERE",
  "operatorKey": "YOUR_OPC_HERE",
  // ... rest of subscriber data
});
```

Then update `ueransim/ue.yaml` with the new credentials.

### Changing Network Parameters

1. **PLMN (MCC/MNC)**:
   - Update `open5gs/amf.yaml`
   - Update `ueransim/gnb.yaml`
   - Update `ueransim/ue.yaml`

2. **Network Slice**:
   - Update `open5gs/amf.yaml` (plmn_support section)
   - Update `ueransim/gnb.yaml` (slices section)
   - Update `ueransim/ue.yaml` (configured-nssai section)
   - Update subscriber data in MongoDB

3. **DNN (Data Network Name)**:
   - Update `open5gs/smf.yaml` (subnet section)
   - Update `open5gs/upf.yaml` (subnet section)
   - Update `ueransim/ue.yaml` (sessions section)
   - Update subscriber data in MongoDB

### Pointing to External Services

If you want to use external Open5GS installation instead of Docker:

1. Edit `docker-compose.test.yml`
2. Remove the Open5GS service you want to use externally
3. Update other services to point to the external IP/port

## Files Modified to Work with Your UDM

These files are specifically configured to use your custom UDM instead of the default Open5GS UDM:

- `open5gs/ausf.yaml` - Points to `http://10.100.200.10:3000`
- `open5gs/amf.yaml` - Points to `http://10.100.200.10:3000`
- `open5gs/smf.yaml` - Points to `http://10.100.200.10:3000`

## Running Individual Components

You can start specific components for testing:

```bash
cd test-config/ueransim
docker build -f Dockerfile.ueransim -t ueransim .
docker run --rm -it ueransim bash
```

Or test configurations:

```bash
docker-compose -f docker-compose.test.yml up -d mongodb
docker-compose -f docker-compose.test.yml up open5gs-nrf
```

## Logs and Debugging

Configuration files use `info` log level by default. To enable debug logging:

Edit any `open5gs/*.yaml` file:
```yaml
logger:
  level: debug  # Change from 'info' to 'debug'
```

Then restart:
```bash
docker-compose -f docker-compose.test.yml restart <service-name>
```

## Important Notes

- **MongoDB** is shared between your UDM and Open5GS UDR
  - Your UDM uses database: `udm`
  - Open5GS uses database: `open5gs`

- **Security**: These are test configurations with weak/default security
  - Do NOT use in production
  - Default test keys are well-known values

- **Resource Requirements**:
  - Minimum 8GB RAM recommended
  - ~15 Docker containers will be running
  - ~10GB disk space for images

## Troubleshooting Configuration Issues

If components can't communicate:

1. Verify all containers are on the same network:
   ```bash
   docker network inspect hss_5g-core
   ```

2. Test connectivity between containers:
   ```bash
   docker-compose -f docker-compose.test.yml exec open5gs-ausf ping custom-udm
   ```

3. Check if services are listening:
   ```bash
   docker-compose -f docker-compose.test.yml exec custom-udm netstat -tlnp
   ```

4. Verify DNS resolution:
   ```bash
   docker-compose -f docker-compose.test.yml exec open5gs-ausf nslookup custom-udm
   ```


