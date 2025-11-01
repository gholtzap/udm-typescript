# 5G SA Test Environment - Quick Start Guide

This directory contains scripts to set up and verify a complete 5G Standalone (SA) test environment with your custom UDM implementation.

## Quick Start

### Windows (PowerShell)

```powershell
cd test-config
.\verify-5g-environment.ps1
```

### Linux/macOS (Bash)

```bash
cd test-config
chmod +x verify-5g-environment.sh
./verify-5g-environment.sh
```

## What the Verification Script Does

The script performs a complete end-to-end test of your 5G SA environment:

### 1. Environment Setup
- Cleans up any existing containers
- Starts MongoDB for subscriber data storage
- Starts Open5GS Network Repository Function (NRF)
- Starts Open5GS Unified Data Repository (UDR)

### 2. Subscriber Initialization
- Creates a test subscriber in MongoDB with credentials:
  - **SUPI**: `imsi-999700000000001`
  - **PLMN**: MCC=999, MNC=70
  - **Network Slice**: SST=1, SD=0x010203
  - Authentication keys configured for 5G-AKA

### 3. Custom UDM Testing
- Starts your custom TypeScript UDM implementation
- Tests critical UDM endpoints:
  - Access and Mobility Data (AM Data)
  - SMF Selection Data
  - Session Management Data
- Verifies HTTP 200 responses from all endpoints

### 4. 5G Core Network Functions
- Starts all Open5GS network functions:
  - **AUSF** - Authentication Server Function
  - **AMF** - Access and Mobility Management Function
  - **SMF** - Session Management Function
  - **UPF** - User Plane Function
  - **PCF** - Policy Control Function
  - **BSF** - Binding Support Function
- Verifies each service is running

### 5. RAN Simulation
- Starts UERANSIM gNB (simulated 5G base station)
- Verifies gNB successfully connects to AMF
- Checks NG Setup procedure completion

### 6. UE Simulation
- Starts UERANSIM UE (simulated 5G phone)
- Monitors UE registration to the 5G network
- Verifies PDU session establishment

### 7. End-to-End Connectivity Test
- Tests internet connectivity from the UE
- Pings 8.8.8.8 through the entire 5G core network
- Verifies complete data path: UE → gNB → AMF → SMF → UPF → Internet

### 8. Test Summary
- Displays status of all services
- Shows PASS/FAIL for end-to-end test
- Provides helpful commands for monitoring and debugging

## Expected Output

When successful, you'll see:

```
╔═══════════════════════════════════════════════════════════╗
║  ✓ 5G SA Test Environment is FULLY OPERATIONAL         ║
╚═══════════════════════════════════════════════════════════╝
```

All services will show as RUNNING, and the ping test will show 4 packets transmitted and received.

## Troubleshooting

### Service Not Starting

Check logs for a specific service:

```bash
docker-compose -f docker-compose.test.yml logs <service-name>
```

Examples:
- `docker-compose -f docker-compose.test.yml logs custom-udm`
- `docker-compose -f docker-compose.test.yml logs open5gs-amf`
- `docker-compose -f docker-compose.test.yml logs ueransim-ue`

### UE Registration Failing

Check authentication flow:
```bash
# Check AUSF logs
docker-compose -f docker-compose.test.yml logs open5gs-ausf

# Check custom UDM logs
docker-compose -f docker-compose.test.yml logs custom-udm

# Check AMF logs
docker-compose -f docker-compose.test.yml logs open5gs-amf
```

### Connectivity Test Failing

Verify the data path:
```bash
# Check SMF logs
docker-compose -f docker-compose.test.yml logs open5gs-smf

# Check UPF logs
docker-compose -f docker-compose.test.yml logs open5gs-upf

# Try manual ping from UE
docker-compose -f docker-compose.test.yml exec ueransim-ue ping -c 4 8.8.8.8
```

### AMF Crashes (WSL2/Docker Desktop)

If you see `epoll_create() failed` errors in AMF logs, this is a known WSL2 compatibility issue. The environment still works during the windows when AMF is running. Consider:

1. Testing on native Linux
2. Accepting periodic AMF restarts (they happen automatically)
3. Using Windows with Docker Desktop in Linux container mode

## Network Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    5G Core Network                          │
│                   (10.100.200.0/24)                          │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ MongoDB  │  │   NRF    │  │   UDR    │  │   BSF    │   │
│  │ :27017   │  │ :7777    │  │ :7777    │  │ :7777    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Custom UDM (Your Implementation)          │  │
│  │            TypeScript/Express :3000                   │  │
│  │            IP: 10.100.200.10                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   AUSF   │  │   AMF    │  │   SMF    │  │   PCF    │   │
│  │ :7777    │  │ :7777    │  │ :7777    │  │ :7777    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  UPF (User Plane)                     │  │
│  │                  :8805                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↑
                            │ NG Interface
                            │
                    ┌───────┴────────┐
                    │  gNB (UERANSIM) │
                    │  Base Station   │
                    └───────┬────────┘
                            │ Radio Interface
                            │
                    ┌───────┴────────┐
                    │  UE (UERANSIM)  │
                    │  Phone Simulator│
                    └────────────────┘
```

## Test Subscriber Details

The verification script creates a test subscriber with these credentials:

| Field | Value |
|-------|-------|
| SUPI | `imsi-999700000000001` |
| Permanent Key (K) | `465B5CE8B199B49FAA5F0A2EE238A6BC` |
| Operator Key (OPc) | `E8ED289DEBA952E4283B54E88E6183CA` |
| Sequence Number | `16F3B3F70FC2` |
| Authentication Method | 5G_AKA |
| MCC | 999 |
| MNC | 70 |
| Network Slice SST | 1 |
| Network Slice SD | 0x010203 |

## Useful Commands

### Monitor Logs in Real-Time

```bash
# Watch all logs
docker-compose -f docker-compose.test.yml logs -f

# Watch specific service
docker-compose -f docker-compose.test.yml logs -f custom-udm
docker-compose -f docker-compose.test.yml logs -f open5gs-amf
docker-compose -f docker-compose.test.yml logs -f ueransim-ue
```

### Test Custom UDM Endpoints

```bash
# Get subscriber AM data
curl http://localhost:3000/nudm-sdm/v2/imsi-999700000000001/am-data

# Get SMF selection data
curl http://localhost:3000/nudm-sdm/v2/imsi-999700000000001/smf-select-data

# Get session management data
curl http://localhost:3000/nudm-sdm/v2/imsi-999700000000001/sm-data
```

### Interactive UE Shell

```bash
# Access UE container
docker-compose -f docker-compose.test.yml exec ueransim-ue bash

# Inside container, test connectivity
ping 8.8.8.8
ping google.com
curl http://example.com
```

### Restart Specific Service

```bash
docker-compose -f docker-compose.test.yml restart custom-udm
docker-compose -f docker-compose.test.yml restart open5gs-amf
```

### Stop Environment

```bash
# Stop all containers
docker-compose -f docker-compose.test.yml down

# Stop and remove volumes (clean slate)
docker-compose -f docker-compose.test.yml down -v
```

## Development Workflow

1. **Start environment**: Run verification script
2. **Make changes**: Edit your UDM code in `src/`
3. **Hot reload**: The custom-udm container uses `npm run dev` with auto-reload
4. **Test changes**: Use curl or wait for UE to re-register
5. **View logs**: `docker-compose -f docker-compose.test.yml logs -f custom-udm`
6. **Iterate**: Repeat steps 2-5

## Files in This Directory

- `verify-5g-environment.ps1` - PowerShell verification script (Windows)
- `verify-5g-environment.sh` - Bash verification script (Linux/macOS)
- `start-test-env.ps1` - Basic startup script without verification (PowerShell)
- `start-test-env.sh` - Basic startup script without verification (Bash)
- `open5gs/` - Configuration files for Open5GS network functions
  - `amf.yaml` - AMF configuration with direct UDM URI
  - `ausf.yaml` - AUSF configuration
  - `nrf.yaml` - NRF configuration
  - `udr.yaml` - UDR configuration with MongoDB
  - `smf.yaml` - SMF configuration
  - `upf.yaml` - UPF configuration
  - `pcf.yaml` - PCF configuration with MongoDB
  - `bsf.yaml` - BSF configuration
- `ueransim/` - Configuration files for RAN/UE simulator
  - `gnb.yaml` - gNB (base station) configuration
  - `ue.yaml` - UE (phone) configuration with test credentials
  - `Dockerfile.ueransim` - UERANSIM container build file

## Next Steps

After successful verification:

1. **Monitor authentication flows**: Watch how your UDM handles authentication requests
2. **Test different scenarios**: Modify subscriber data and see how it affects registration
3. **Implement missing endpoints**: Add support for additional UDM services
4. **Load testing**: Register multiple UEs to test concurrent handling
5. **Integration testing**: Write automated tests against your UDM implementation

## Support

For issues with:
- **Open5GS**: https://open5gs.org/
- **UERANSIM**: https://github.com/aligungr/UERANSIM
- **This test environment**: Check container logs and verify configuration files match your setup

## License

This test configuration is provided as-is for development and testing purposes.
