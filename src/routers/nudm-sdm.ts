import { Router, Request, Response } from 'express';
import { 
  SubscriptionDataSets, 
  DataSetName, 
  AccessAndMobilitySubscriptionData,
  SmfSelectionSubscriptionData,
  SessionManagementSubscriptionData,
  SmsSubscriptionData,
  SmsManagementSubscriptionData,
  UeContextInAmfData,
  UeContextInSmfData,
  UeContextInSmsfData,
  TraceData,
  TraceDataResponse,
  TraceDepth,
  LcsPrivacyData,
  LcsMoData,
  LcsMoServiceClass,
  LcsSubscriptionData,
  PruInd,
  V2xSubscriptionData,
  LcsBroadcastAssistanceTypesData,
  ProseSubscriptionData,
  MbsSubscriptionData,
  UcSubscriptionData,
  UcPurpose,
  UserConsent,
  Nssai,
  EnhancedCoverageRestrictionData,
  SmSubsData,
  PduSessionTypes,
  SscModes,
  SscMode,
  SubscribedDefaultQos,
  PreemptionCapability,
  PreemptionVulnerability,
  LocationPrivacyInd,
  LcsClientClass,
  PrivacyCheckRelatedAction,
  SdmSubscription
} from '../types/nudm-sdm-types';
import { validateUeIdentity, createInvalidParameterError, createMissingParameterError, PlmnId, Snssai, AccessType, PduSessionType } from '../types/common-types';

const router = Router();

const subscriptionDataStore = new Map<string, SubscriptionDataSets>();
const sdmSubscriptionStore = new Map<string, Map<string, SdmSubscription>>();

const notImplemented = (req: Request, res: Response) => {
  res.status(501).json({
    title: 'Not Implemented',
    status: 501,
    detail: 'This endpoint is not yet implemented'
  });
};

router.get('/:supi', (req: Request, res: Response) => {
  const { supi } = req.params;
  const datasetNames = req.query['dataset-names'] as string;
  const plmnId = req.query['plmn-id'] as string | undefined;
  const adjacentPlmns = req.query['adjacent-plmns'] as string | undefined;
  const singleNssai = req.query['single-nssai'] as string | undefined;
  const dnn = req.query['dnn'] as string | undefined;
  const ucPurpose = req.query['uc-purpose'] as string | undefined;
  const disasterRoamingInd = req.query['disaster-roaming-ind'] === 'true';
  const supportedFeatures = req.query['supported-features'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  if (!datasetNames) {
    return res.status(400).json(createMissingParameterError('dataset-names query parameter is required'));
  }

  const requestedDatasets = datasetNames.split(',').map(ds => ds.trim() as DataSetName);
  
  for (const dataset of requestedDatasets) {
    if (!Object.values(DataSetName).includes(dataset)) {
      return res.status(400).json(createInvalidParameterError(`Invalid dataset name: ${dataset}`));
    }
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  const response: SubscriptionDataSets = {};

  for (const dataset of requestedDatasets) {
    switch (dataset) {
      case DataSetName.AM:
        response.amData = storedData.amData;
        break;
      case DataSetName.SMF_SEL:
        response.smfSelData = storedData.smfSelData;
        break;
      case DataSetName.UEC_SMF:
        response.uecSmfData = storedData.uecSmfData;
        break;
      case DataSetName.UEC_SMSF:
        response.uecSmsfData = storedData.uecSmsfData;
        break;
      case DataSetName.SMS_SUB:
        response.smsSubsData = storedData.smsSubsData;
        break;
      case DataSetName.SM:
        response.smData = storedData.smData;
        break;
      case DataSetName.TRACE:
        response.traceData = storedData.traceData;
        break;
      case DataSetName.SMS_MNG:
        response.smsMngData = storedData.smsMngData;
        break;
      case DataSetName.LCS_PRIVACY:
        response.lcsPrivacyData = storedData.lcsPrivacyData;
        break;
      case DataSetName.LCS_MO:
        response.lcsMoData = storedData.lcsMoData;
        break;
      case DataSetName.UEC_AMF:
        response.uecAmfData = storedData.uecAmfData;
        break;
      case DataSetName.V2X:
        response.v2xData = storedData.v2xData;
        break;
      case DataSetName.LCS_BCA:
        response.lcsBroadcastAssistanceTypesData = storedData.lcsBroadcastAssistanceTypesData;
        break;
      case DataSetName.PROSE:
        response.proseData = storedData.proseData;
        break;
      case DataSetName.UC:
        response.ucData = storedData.ucData;
        break;
      case DataSetName.MBS:
        response.mbsData = storedData.mbsData;
        break;
    }
  }

  return res.status(200).json(response);
});

router.get('/:supi/nssai', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;
  const plmnId = req.query['plmn-id'] as string | undefined;
  const disasterRoamingInd = req.query['disaster-roaming-ind'] === 'true';

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  if (!storedData.amData?.nssai) {
    return res.status(404).json({
      title: 'Not Found',
      status: 404,
      detail: `NSSAI data not found for SUPI: ${supi}`
    });
  }

  const response: Nssai = {
    ...storedData.amData.nssai
  };

  if (supportedFeatures) {
    response.supportedFeatures = supportedFeatures;
  }

  return res.status(200).json(response);
});

router.get('/:supi/ue-context-in-amf-data', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  if (!storedData.uecAmfData) {
    storedData.uecAmfData = {
      amfInfo: [
        {
          amfInstanceId: `amf-instance-${supi.slice(-8)}`,
          guami: {
            plmnId: {
              mcc: '001',
              mnc: '01'
            },
            amfId: '010001'
          },
          accessType: AccessType.THREE_GPP_ACCESS
        }
      ]
    };
    subscriptionDataStore.set(supi, storedData);
  }

  const response: UeContextInAmfData = {
    ...storedData.uecAmfData
  };

  return res.status(200).json(response);
});

router.get('/:supi/am-data', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;
  const plmnIdParam = req.query['plmn-id'] as string | undefined;
  const adjacentPlmnsParam = req.query['adjacent-plmns'] as string | undefined;
  const disasterRoamingInd = req.query['disaster-roaming-ind'] === 'true';
  const sharedDataIds = req.query['shared-data-ids'] as string | undefined;
  const ifNoneMatch = req.headers['if-none-match'] as string | undefined;
  const ifModifiedSince = req.headers['if-modified-since'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  let plmnId: PlmnId | undefined;
  if (plmnIdParam) {
    try {
      plmnId = JSON.parse(plmnIdParam) as PlmnId;
      if (!plmnId.mcc || !plmnId.mnc) {
        return res.status(400).json(createInvalidParameterError('Invalid plmn-id format'));
      }
    } catch (e) {
      return res.status(400).json(createInvalidParameterError('Invalid plmn-id JSON format'));
    }
  }

  let adjacentPlmns: PlmnId[] | undefined;
  if (adjacentPlmnsParam) {
    try {
      adjacentPlmns = JSON.parse(adjacentPlmnsParam) as PlmnId[];
      if (!Array.isArray(adjacentPlmns) || adjacentPlmns.length === 0) {
        return res.status(400).json(createInvalidParameterError('Invalid adjacent-plmns format'));
      }
    } catch (e) {
      return res.status(400).json(createInvalidParameterError('Invalid adjacent-plmns JSON format'));
    }
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  if (!storedData.amData) {
    return res.status(404).json({
      title: 'Not Found',
      status: 404,
      detail: `Access and Mobility Subscription Data not found for SUPI: ${supi}`
    });
  }

  const response: AccessAndMobilitySubscriptionData = {
    ...storedData.amData
  };

  if (supportedFeatures) {
    response.supportedFeatures = supportedFeatures;
  }

  const headers: Record<string, string> = {
    'Cache-Control': 'max-age=3600',
    'ETag': `"${supi}-amdata-v1"`,
    'Last-Modified': new Date().toUTCString()
  };

  res.set(headers);
  return res.status(200).json(response);
});

router.get('/:supi/am-data/ecr-data', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;
  const ifNoneMatch = req.headers['if-none-match'] as string | undefined;
  const ifModifiedSince = req.headers['if-modified-since'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  const response: EnhancedCoverageRestrictionData = {
    plmnEcInfoList: []
  };

  const headers: Record<string, string> = {
    'Cache-Control': 'max-age=3600',
    'ETag': `"${supi}-ecrdata-v1"`,
    'Last-Modified': new Date().toUTCString()
  };

  res.set(headers);
  return res.status(200).json(response);
});

router.get('/:supi/smf-select-data', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;
  const plmnIdParam = req.query['plmn-id'] as string | undefined;
  const disasterRoamingInd = req.query['disaster-roaming-ind'] === 'true';
  const ifNoneMatch = req.headers['if-none-match'] as string | undefined;
  const ifModifiedSince = req.headers['if-modified-since'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  let plmnId: PlmnId | undefined;
  if (plmnIdParam) {
    try {
      plmnId = JSON.parse(plmnIdParam) as PlmnId;
      if (!plmnId.mcc || !plmnId.mnc) {
        return res.status(400).json(createInvalidParameterError('Invalid plmn-id format'));
      }
    } catch (e) {
      return res.status(400).json(createInvalidParameterError('Invalid plmn-id JSON format'));
    }
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  if (!storedData.smfSelData) {
    return res.status(404).json({
      title: 'Not Found',
      status: 404,
      detail: `SMF Selection Subscription Data not found for SUPI: ${supi}`
    });
  }

  const response: SmfSelectionSubscriptionData = {
    ...storedData.smfSelData
  };

  if (supportedFeatures) {
    response.supportedFeatures = supportedFeatures;
  }

  const headers: Record<string, string> = {
    'Cache-Control': 'max-age=3600',
    'ETag': `"${supi}-smfseldata-v1"`,
    'Last-Modified': new Date().toUTCString()
  };

  res.set(headers);
  return res.status(200).json(response);
});

router.get('/:supi/ue-context-in-smf-data', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;
  const plmnIdParam = req.query['plmn-id'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  let plmnId: PlmnId | undefined;
  if (plmnIdParam) {
    try {
      plmnId = JSON.parse(plmnIdParam) as PlmnId;
      if (!plmnId.mcc || !plmnId.mnc) {
        return res.status(400).json(createInvalidParameterError('Invalid plmn-id format'));
      }
    } catch (e) {
      return res.status(400).json(createInvalidParameterError('Invalid plmn-id JSON format'));
    }
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  if (!storedData.uecSmfData) {
    const contextPlmnId: PlmnId = plmnId || { mcc: '001', mnc: '01' };
    
    storedData.uecSmfData = {
      pduSessions: {
        '1': {
          dnn: 'internet',
          smfInstanceId: `smf-instance-${supi.slice(-8)}`,
          plmnId: contextPlmnId,
          singleNssai: {
            sst: 1,
            sd: '000001'
          }
        }
      },
      pgwInfo: [
        {
          dnn: 'internet',
          pgwFqdn: `pgw.${contextPlmnId.mcc}.${contextPlmnId.mnc}.5gc.mnc${contextPlmnId.mnc}.mcc${contextPlmnId.mcc}.3gppnetwork.org`,
          plmnId: contextPlmnId
        }
      ]
    };
    subscriptionDataStore.set(supi, storedData);
  }

  const response: UeContextInSmfData = {
    ...storedData.uecSmfData
  };

  return res.status(200).json(response);
});

router.get('/:supi/ue-context-in-smsf-data', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  if (!storedData.uecSmsfData) {
    storedData.uecSmsfData = {
      smsfInfo3GppAccess: {
        smsfInstanceId: `smsf-3gpp-instance-${supi.slice(-8)}`,
        plmnId: {
          mcc: '001',
          mnc: '01'
        },
        smsfSetId: `smsf-set-${supi.slice(-6)}`
      },
      smsfInfoNon3GppAccess: {
        smsfInstanceId: `smsf-non3gpp-instance-${supi.slice(-8)}`,
        plmnId: {
          mcc: '001',
          mnc: '01'
        }
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  const response: UeContextInSmsfData = {
    ...storedData.uecSmsfData
  };

  return res.status(200).json(response);
});

router.get('/:supi/trace-data', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;
  const plmnIdParam = req.query['plmn-id'] as string | undefined;
  const ifNoneMatch = req.headers['if-none-match'] as string | undefined;
  const ifModifiedSince = req.headers['if-modified-since'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  let plmnId: PlmnId | undefined;
  if (plmnIdParam) {
    try {
      plmnId = JSON.parse(plmnIdParam) as PlmnId;
      if (!plmnId.mcc || !plmnId.mnc) {
        return res.status(400).json(createInvalidParameterError('Invalid plmn-id format'));
      }
    } catch (e) {
      return res.status(400).json(createInvalidParameterError('Invalid plmn-id JSON format'));
    }
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  if (!storedData.traceData) {
    const contextPlmnId: PlmnId = plmnId || { mcc: '001', mnc: '01' };
    
    storedData.traceData = {
      traceRef: `${contextPlmnId.mcc}${contextPlmnId.mnc}-trace-${supi.slice(-8)}`,
      traceDepth: TraceDepth.MEDIUM,
      neTypeList: 'AMF,SMF,UPF',
      eventList: 'N1N2_MESSAGE_TRANSFER,PDU_SESSION_ESTABLISHMENT,PDU_SESSION_RELEASE',
      collectionEntityIpv4Addr: '192.168.100.10',
      interfaceList: 'N1,N2,N4'
    };
    subscriptionDataStore.set(supi, storedData);
  }

  const response: TraceDataResponse = {
    traceData: storedData.traceData
  };

  const headers: Record<string, string> = {
    'Cache-Control': 'max-age=3600',
    'ETag': `"${supi}-tracedata-v1"`,
    'Last-Modified': new Date().toUTCString()
  };

  res.set(headers);
  return res.status(200).json(response);
});

router.get('/:supi/sm-data', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;
  const singleNssaiParam = req.query['single-nssai'] as string | undefined;
  const dnn = req.query['dnn'] as string | undefined;
  const plmnIdParam = req.query['plmn-id'] as string | undefined;
  const disasterRoamingInd = req.query['disaster-roaming-ind'] === 'true';
  const ifNoneMatch = req.headers['if-none-match'] as string | undefined;
  const ifModifiedSince = req.headers['if-modified-since'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  let singleNssai: Snssai | undefined;
  if (singleNssaiParam) {
    try {
      singleNssai = JSON.parse(singleNssaiParam) as Snssai;
      if (typeof singleNssai.sst !== 'number') {
        return res.status(400).json(createInvalidParameterError('Invalid single-nssai format'));
      }
    } catch (e) {
      return res.status(400).json(createInvalidParameterError('Invalid single-nssai JSON format'));
    }
  }

  let plmnId: PlmnId | undefined;
  if (plmnIdParam) {
    try {
      plmnId = JSON.parse(plmnIdParam) as PlmnId;
      if (!plmnId.mcc || !plmnId.mnc) {
        return res.status(400).json(createInvalidParameterError('Invalid plmn-id format'));
      }
    } catch (e) {
      return res.status(400).json(createInvalidParameterError('Invalid plmn-id JSON format'));
    }
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  if (!storedData.smData) {
    const defaultSnssai: Snssai = { sst: 1, sd: '000001' };
    const targetSnssai = singleNssai || defaultSnssai;
    
    const sessionManagementData: SessionManagementSubscriptionData = {
      singleNssai: targetSnssai,
      dnnConfigurations: {
        'internet': {
          pduSessionTypes: {
            defaultSessionType: PduSessionType.IPV4V6,
            allowedSessionTypes: [PduSessionType.IPV4, PduSessionType.IPV6, PduSessionType.IPV4V6]
          },
          sscModes: {
            defaultSscMode: SscMode.SSC_MODE_1,
            allowedSscModes: [SscMode.SSC_MODE_1, SscMode.SSC_MODE_2, SscMode.SSC_MODE_3]
          },
          fiveGQosProfile: {
            fiveQi: 9,
            arp: {
              priorityLevel: 8,
              preemptCap: PreemptionCapability.MAY_PREEMPT,
              preemptVuln: PreemptionVulnerability.NOT_PREEMPTABLE
            }
          },
          sessionAmbr: {
            uplink: '500 Mbps',
            downlink: '1000 Mbps'
          }
        },
        'ims': {
          pduSessionTypes: {
            defaultSessionType: PduSessionType.IPV4V6,
            allowedSessionTypes: [PduSessionType.IPV4V6]
          },
          sscModes: {
            defaultSscMode: SscMode.SSC_MODE_1
          },
          fiveGQosProfile: {
            fiveQi: 5,
            arp: {
              priorityLevel: 2,
              preemptCap: PreemptionCapability.MAY_PREEMPT,
              preemptVuln: PreemptionVulnerability.NOT_PREEMPTABLE
            },
            priorityLevel: 1
          },
          sessionAmbr: {
            uplink: '200 Mbps',
            downlink: '200 Mbps'
          }
        }
      }
    };

    storedData.smData = [sessionManagementData];
    subscriptionDataStore.set(supi, storedData);
  }

  let response: SmSubsData;
  
  if (singleNssai || dnn) {
    const filteredData: SessionManagementSubscriptionData[] = [];
    
    if (Array.isArray(storedData.smData)) {
      for (const smData of storedData.smData) {
        let matches = true;
        
        if (singleNssai) {
          if (smData.singleNssai.sst !== singleNssai.sst || 
              (singleNssai.sd && smData.singleNssai.sd !== singleNssai.sd)) {
            matches = false;
          }
        }
        
        if (dnn && matches) {
          if (!smData.dnnConfigurations || !smData.dnnConfigurations[dnn]) {
            matches = false;
          } else {
            const filteredDnnConfigs: Record<string, any> = {};
            filteredDnnConfigs[dnn] = smData.dnnConfigurations[dnn];
            filteredData.push({
              ...smData,
              dnnConfigurations: filteredDnnConfigs
            });
            continue;
          }
        }
        
        if (matches) {
          filteredData.push(smData);
        }
      }
      response = filteredData;
    } else {
      response = storedData.smData;
    }
  } else {
    response = storedData.smData;
  }

  if (Array.isArray(response) && response.length === 0) {
    return res.status(404).json({
      title: 'Not Found',
      status: 404,
      detail: `Session Management Subscription Data not found for SUPI: ${supi}`
    });
  }

  const headers: Record<string, string> = {
    'Cache-Control': 'max-age=3600',
    'ETag': `"${supi}-smdata-v1"`,
    'Last-Modified': new Date().toUTCString()
  };

  res.set(headers);
  return res.status(200).json(response);
});

router.get('/:supi/sms-data', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;
  const plmnIdParam = req.query['plmn-id'] as string | undefined;
  const ifNoneMatch = req.headers['if-none-match'] as string | undefined;
  const ifModifiedSince = req.headers['if-modified-since'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  let plmnId: PlmnId | undefined;
  if (plmnIdParam) {
    try {
      plmnId = JSON.parse(plmnIdParam) as PlmnId;
      if (!plmnId.mcc || !plmnId.mnc) {
        return res.status(400).json(createInvalidParameterError('Invalid plmn-id format'));
      }
    } catch (e) {
      return res.status(400).json(createInvalidParameterError('Invalid plmn-id JSON format'));
    }
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  if (!storedData.smsSubsData) {
    return res.status(404).json({
      title: 'Not Found',
      status: 404,
      detail: `SMS Subscription Data not found for SUPI: ${supi}`
    });
  }

  const response: SmsSubscriptionData = {
    ...storedData.smsSubsData
  };

  if (supportedFeatures) {
    response.supportedFeatures = supportedFeatures;
  }

  const headers: Record<string, string> = {
    'Cache-Control': 'max-age=3600',
    'ETag': `"${supi}-smsdata-v1"`,
    'Last-Modified': new Date().toUTCString()
  };

  res.set(headers);
  return res.status(200).json(response);
});

router.get('/:supi/sms-mng-data', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;
  const plmnIdParam = req.query['plmn-id'] as string | undefined;
  const ifNoneMatch = req.headers['if-none-match'] as string | undefined;
  const ifModifiedSince = req.headers['if-modified-since'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  let plmnId: PlmnId | undefined;
  if (plmnIdParam) {
    try {
      plmnId = JSON.parse(plmnIdParam) as PlmnId;
      if (!plmnId.mcc || !plmnId.mnc) {
        return res.status(400).json(createInvalidParameterError('Invalid plmn-id format'));
      }
    } catch (e) {
      return res.status(400).json(createInvalidParameterError('Invalid plmn-id JSON format'));
    }
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  if (!storedData.smsMngData) {
    storedData.smsMngData = {
      mtSmsSubscribed: true,
      mtSmsBarringAll: false,
      mtSmsBarringRoaming: false,
      moSmsSubscribed: true,
      moSmsBarringAll: false,
      moSmsBarringRoaming: false
    };
    subscriptionDataStore.set(supi, storedData);
  }

  const response: SmsManagementSubscriptionData = {
    ...storedData.smsMngData
  };

  if (supportedFeatures) {
    response.supportedFeatures = supportedFeatures;
  }

  const headers: Record<string, string> = {
    'Cache-Control': 'max-age=3600',
    'ETag': `"${supi}-smsmngdata-v1"`,
    'Last-Modified': new Date().toUTCString()
  };

  res.set(headers);
  return res.status(200).json(response);
});

router.get('/:ueId/lcs-privacy-data', (req: Request, res: Response) => {
  const { ueId } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;
  const ifNoneMatch = req.headers['if-none-match'] as string | undefined;
  const ifModifiedSince = req.headers['if-modified-since'] as string | undefined;

  if (!validateUeIdentity(ueId, ['imsi', 'nai', 'msisdn', 'extid', 'gci', 'gli'], true)) {
    return res.status(400).json(createInvalidParameterError('Invalid ueId format'));
  }

  let storedData = subscriptionDataStore.get(ueId);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${ueId.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(ueId, storedData);
  }

  if (!storedData.lcsPrivacyData) {
    storedData.lcsPrivacyData = {
      lpi: {
        locationPrivacyInd: LocationPrivacyInd.LOCATION_ALLOWED,
        validTimePeriod: {
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      unrelatedClass: {
        defaultUnrelatedClass: {
          privacyCheckRelatedAction: PrivacyCheckRelatedAction.LOCATION_ALLOWED_WITH_NOTIFICATION
        }
      },
      plmnOperatorClasses: [
        {
          lcsClientClass: LcsClientClass.BROADCAST_SERVICE,
          lcsClientIds: ['broadcast-client-1']
        },
        {
          lcsClientClass: LcsClientClass.OM_IN_HPLMN,
          lcsClientIds: ['om-hplmn-client-1', 'om-hplmn-client-2']
        }
      ]
    };
    subscriptionDataStore.set(ueId, storedData);
  }

  const response: LcsPrivacyData = {
    ...storedData.lcsPrivacyData
  };

  const headers: Record<string, string> = {
    'Cache-Control': 'max-age=3600',
    'ETag': `"${ueId}-lcsprivacydata-v1"`,
    'Last-Modified': new Date().toUTCString()
  };

  res.set(headers);
  return res.status(200).json(response);
});

router.get('/:supi/lcs-mo-data', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;
  const ifNoneMatch = req.headers['if-none-match'] as string | undefined;
  const ifModifiedSince = req.headers['if-modified-since'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  if (!storedData.lcsMoData) {
    storedData.lcsMoData = {
      allowedServiceClasses: [
        LcsMoServiceClass.BASIC_SELF_LOCATION,
        LcsMoServiceClass.AUTONOMOUS_SELF_LOCATION
      ],
      moAssistanceDataTypes: {
        locationAssistanceType: 'A-GPS,A-GNSS'
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  const response: LcsMoData = {
    ...storedData.lcsMoData
  };

  const headers: Record<string, string> = {
    'Cache-Control': 'max-age=3600',
    'ETag': `"${supi}-lcsmodata-v1"`,
    'Last-Modified': new Date().toUTCString()
  };

  res.set(headers);
  return res.status(200).json(response);
});

router.get('/:supi/lcs-bca-data', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;
  const plmnId = req.query['plmn-id'] as string | undefined;
  const ifNoneMatch = req.headers['if-none-match'] as string | undefined;
  const ifModifiedSince = req.headers['if-modified-since'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  if (!storedData.lcsBroadcastAssistanceTypesData) {
    storedData.lcsBroadcastAssistanceTypesData = {
      locationAssistanceType: 'A-GPS,A-GNSS,OTDOA,ECID'
    };
    subscriptionDataStore.set(supi, storedData);
  }

  const response: LcsBroadcastAssistanceTypesData = {
    ...storedData.lcsBroadcastAssistanceTypesData
  };

  const headers: Record<string, string> = {
    'Cache-Control': 'max-age=3600',
    'ETag': `"${supi}-lcsbcadata-v1"`,
    'Last-Modified': new Date().toUTCString()
  };

  res.set(headers);
  return res.status(200).json(response);
});

router.get('/:supi/lcs-subscription-data', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;
  const ifNoneMatch = req.headers['if-none-match'] as string | undefined;
  const ifModifiedSince = req.headers['if-modified-since'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  if (!storedData.lcsSubscriptionData) {
    storedData.lcsSubscriptionData = {
      configuredLmfId: `lmf-${supi.slice(-8)}`,
      pruInd: PruInd.NON_PRU,
      lpHapType: 'standard',
      userPlanePosIndLmf: false
    };
    subscriptionDataStore.set(supi, storedData);
  }

  const response: LcsSubscriptionData = {
    ...storedData.lcsSubscriptionData
  };

  const headers: Record<string, string> = {
    'Cache-Control': 'max-age=3600',
    'ETag': `"${supi}-lcssubsdata-v1"`,
    'Last-Modified': new Date().toUTCString()
  };

  res.set(headers);
  return res.status(200).json(response);
});

router.get('/:supi/v2x-data', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;
  const ifNoneMatch = req.headers['if-none-match'] as string | undefined;
  const ifModifiedSince = req.headers['if-modified-since'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  if (!storedData.v2xData) {
    storedData.v2xData = {
      nrV2xServicesAuth: {
        vehicleUe: true,
        pedestrianUe: false,
        v2xPermission: {
          v2xCommunicationPermission: true,
          v2xMessagingPermission: true
        }
      },
      lteV2xServicesAuth: {
        vehicleUe: true,
        pedestrianUe: false,
        v2xPermission: {
          v2xCommunicationPermission: true,
          v2xMessagingPermission: true
        }
      },
      nrUePc5Ambr: '100 Mbps',
      ltePc5Ambr: '50 Mbps'
    };
    subscriptionDataStore.set(supi, storedData);
  }

  const response: V2xSubscriptionData = {
    ...storedData.v2xData
  };

  const headers: Record<string, string> = {
    'Cache-Control': 'max-age=3600',
    'ETag': `"${supi}-v2xdata-v1"`,
    'Last-Modified': new Date().toUTCString()
  };

  res.set(headers);
  return res.status(200).json(response);
});

router.get('/:supi/prose-data', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;
  const ifNoneMatch = req.headers['if-none-match'] as string | undefined;
  const ifModifiedSince = req.headers['if-modified-since'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  if (!storedData.proseData) {
    storedData.proseData = {
      proseServiceAuth: {
        proseDirectDiscoveryAuth: true,
        proseDirectCommunicationAuth: true,
        proseL2RelayAuth: false,
        proseL3RelayAuth: false,
        proseL2RemoteAuth: false
      },
      nrUePc5Ambr: '100 Mbps',
      proseAllowedPlmn: [
        {
          visitedPlmn: {
            mcc: '001',
            mnc: '01'
          }
        }
      ]
    };
    subscriptionDataStore.set(supi, storedData);
  }

  const response: ProseSubscriptionData = {
    ...storedData.proseData
  };

  const headers: Record<string, string> = {
    'Cache-Control': 'max-age=3600',
    'ETag': `"${supi}-prosedata-v1"`,
    'Last-Modified': new Date().toUTCString()
  };

  res.set(headers);
  return res.status(200).json(response);
});

router.get('/:supi/5mbs-data', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;
  const ifNoneMatch = req.headers['if-none-match'] as string | undefined;
  const ifModifiedSince = req.headers['if-modified-since'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  if (!storedData.mbsData) {
    storedData.mbsData = {
      mbsAllowed: true,
      mbsSessionIdList: [
        `mbs-session-${supi.slice(-8)}-001`,
        `mbs-session-${supi.slice(-8)}-002`
      ]
    };
    subscriptionDataStore.set(supi, storedData);
  }

  const response: MbsSubscriptionData = {
    ...storedData.mbsData
  };

  const headers: Record<string, string> = {
    'Cache-Control': 'max-age=3600',
    'ETag': `"${supi}-mbsdata-v1"`,
    'Last-Modified': new Date().toUTCString()
  };

  res.set(headers);
  return res.status(200).json(response);
});

router.get('/:supi/uc-data', (req: Request, res: Response) => {
  const { supi } = req.params;
  const supportedFeatures = req.query['supported-features'] as string | undefined;
  const ucPurposeParam = req.query['uc-purpose'] as string | undefined;
  const ifNoneMatch = req.headers['if-none-match'] as string | undefined;
  const ifModifiedSince = req.headers['if-modified-since'] as string | undefined;

  if (!validateUeIdentity(supi, ['imsi', 'nai', 'gci', 'gli'])) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  if (ucPurposeParam && !Object.values(UcPurpose).includes(ucPurposeParam as UcPurpose)) {
    return res.status(400).json(createInvalidParameterError('Invalid uc-purpose value'));
  }

  let storedData = subscriptionDataStore.get(supi);
  
  if (!storedData) {
    storedData = {
      amData: {
        gpsis: [`msisdn-${supi.slice(-10)}`],
        subscribedUeAmbr: {
          uplink: '1000 Mbps',
          downlink: '2000 Mbps'
        },
        nssai: {
          defaultSingleNssais: [
            { sst: 1, sd: '000001' }
          ],
          singleNssais: [
            { sst: 1, sd: '000001' },
            { sst: 2, sd: '000002' }
          ]
        },
        ratRestrictions: []
      },
      smfSelData: {
        subscribedSnssaiInfos: {
          '1-000001': {
            dnnInfos: [
              {
                dnn: 'internet',
                defaultDnnIndicator: true
              }
            ]
          }
        }
      },
      smsSubsData: {
        smsSubscribed: true
      }
    };
    subscriptionDataStore.set(supi, storedData);
  }

  if (!storedData.ucData) {
    storedData.ucData = {
      userConsentPerPurposeList: {
        [UcPurpose.ANALYTICS]: UserConsent.CONSENT_GIVEN,
        [UcPurpose.MODEL_TRAINING]: UserConsent.CONSENT_NOT_GIVEN,
        [UcPurpose.NW_CAP_EXPOSURE]: UserConsent.CONSENT_GIVEN,
        [UcPurpose.EDGEAPP_UE_LOCATION]: UserConsent.CONSENT_NOT_GIVEN
      }
    };
  }

  const response: UcSubscriptionData = { ...storedData.ucData };

  if (ucPurposeParam) {
    const ucPurpose = ucPurposeParam as UcPurpose;
    if (response.userConsentPerPurposeList && response.userConsentPerPurposeList[ucPurpose] !== undefined) {
      response.userConsentPerPurposeList = {
        [ucPurpose]: response.userConsentPerPurposeList[ucPurpose]
      };
    } else {
      response.userConsentPerPurposeList = {};
    }
  }

  res.status(200).json(response);
});

router.post('/:ueId/sdm-subscriptions', (req: Request, res: Response) => {
  const { ueId } = req.params;
  const sharedDataIds = req.query['shared-data-ids'] as string | undefined;

  if (!validateUeIdentity(ueId)) {
    return res.status(400).json(createInvalidParameterError('Invalid ueId format'));
  }

  const subscriptionRequest = req.body as SdmSubscription;

  if (!subscriptionRequest.nfInstanceId) {
    return res.status(400).json(createMissingParameterError('nfInstanceId is required'));
  }

  if (!subscriptionRequest.callbackReference) {
    return res.status(400).json(createMissingParameterError('callbackReference is required'));
  }

  if (!subscriptionRequest.monitoredResourceUris || subscriptionRequest.monitoredResourceUris.length === 0) {
    return res.status(400).json(createMissingParameterError('monitoredResourceUris is required and must not be empty'));
  }

  const subscriptionId = `sub-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

  const subscription: SdmSubscription = {
    ...subscriptionRequest,
    subscriptionId
  };

  let ueSubscriptions = sdmSubscriptionStore.get(ueId);
  if (!ueSubscriptions) {
    ueSubscriptions = new Map<string, SdmSubscription>();
    sdmSubscriptionStore.set(ueId, ueSubscriptions);
  }
  ueSubscriptions.set(subscriptionId, subscription);

  const locationUri = `/nudm-sdm/v2/${ueId}/sdm-subscriptions/${subscriptionId}`;

  res.status(201).header('Location', locationUri).json(subscription);
});

router.delete('/:ueId/sdm-subscriptions/:subscriptionId', notImplemented);

router.patch('/:ueId/sdm-subscriptions/:subscriptionId', notImplemented);

router.get('/:ueId/id-translation-result', notImplemented);

router.put('/:supi/am-data/sor-ack', notImplemented);

router.put('/:supi/am-data/upu-ack', notImplemented);

router.put('/:supi/am-data/subscribed-snssais-ack', notImplemented);

router.put('/:supi/am-data/cag-ack', notImplemented);

router.post('/:supi/am-data/update-sor', notImplemented);

router.get('/shared-data', notImplemented);

router.post('/shared-data-subscriptions', notImplemented);

router.delete('/shared-data-subscriptions/:subscriptionId', notImplemented);

router.patch('/shared-data-subscriptions/:subscriptionId', notImplemented);

router.get('/group-data/group-identifiers', notImplemented);

router.get('/shared-data/:sharedDataId', notImplemented);

router.get('/multiple-identifiers', notImplemented);

router.get('/:supi/time-sync-data', notImplemented);

router.get('/:supi/ranging-slpos-data', notImplemented);

router.get('/:supi/a2x-data', notImplemented);

router.get('/:ueId/rangingsl-privacy-data', notImplemented);

export default router;

