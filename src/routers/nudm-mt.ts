import { Router, Request, Response } from 'express';
import { 
  UeContextInfo, 
  FiveGSrvccInfo, 
  LocationInfoRequest, 
  LocationInfoResult,
  Ncgi,
  Tai,
  ProblemDetails
} from '../types/nudm-mt-types';
import { PlmnId, RatType, createInvalidParameterError } from '../types/common-types';

const router = Router();

interface StoredUeInfo {
  tadsInfo?: {
    ueContextInfo?: UeContextInfo;
  };
  userState?: {
    accessType: string;
    registrationState: string;
  };
  '5gSrvccInfo'?: FiveGSrvccInfo;
}

const ueInfoStore = new Map<string, StoredUeInfo>();

const notImplemented = (req: Request, res: Response) => {
  res.status(501).json({
    title: 'Not Implemented',
    status: 501,
    detail: 'This endpoint is not yet implemented'
  });
};

router.get('/:supi', (req: Request, res: Response) => {
  const { supi } = req.params;
  const fields = req.query.fields;
  const supportedFeatures = req.query['supported-features'];

  const supiPattern = /^(imsi-[0-9]{5,15}|nai-.+)$/;
  if (!supiPattern.test(supi)) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  if (!fields) {
    return res.status(400).json({
      type: 'urn:3gpp:error:missing-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Missing required query parameter: fields',
      cause: 'MANDATORY_IE_MISSING'
    });
  }

  let fieldsArray: string[];
  if (Array.isArray(fields)) {
    fieldsArray = fields.filter(f => typeof f === 'string') as string[];
  } else if (typeof fields === 'string') {
    fieldsArray = fields.split(',').map(f => f.trim());
  } else {
    fieldsArray = [];
  }
  
  if (fieldsArray.length === 0) {
    return res.status(400).json(createInvalidParameterError('fields parameter must contain at least one item'));
  }

  let ueInfo = ueInfoStore.get(supi);
  
  if (!ueInfo) {
    const contextInfo: UeContextInfo = {
      supportVoPS: true,
      lastActTime: new Date().toISOString()
    };
    
    const srvccInfo: FiveGSrvccInfo = {
      ue5GSrvccCapability: true,
      stnSr: '1234567890',
      cMsisdn: '0987654321'
    };
    
    ueInfo = {
      tadsInfo: {
        ueContextInfo: contextInfo
      },
      userState: {
        accessType: '3GPP_ACCESS',
        registrationState: 'REGISTERED'
      },
      '5gSrvccInfo': srvccInfo
    };
    ueInfoStore.set(supi, ueInfo);
  }

  const response: Record<string, any> = {};
  
  for (const field of fieldsArray) {
    if (field === 'tadsInfo' && ueInfo.tadsInfo) {
      response.tadsInfo = ueInfo.tadsInfo;
    } else if (field === 'userState' && ueInfo.userState) {
      response.userState = ueInfo.userState;
    } else if (field === '5gSrvccInfo' && ueInfo['5gSrvccInfo']) {
      response['5gSrvccInfo'] = ueInfo['5gSrvccInfo'];
    }
  }

  if (supportedFeatures) {
    response.supportedFeatures = supportedFeatures;
  }

  res.status(200).json(response);
});

router.post('/:supi/loc-info/provide-loc-info', (req: Request, res: Response) => {
  const { supi } = req.params;
  const body = req.body as LocationInfoRequest;

  const supiPattern = /^(imsi-[0-9]{5,15}|nai-.+)$/;
  if (!supiPattern.test(supi)) {
    return res.status(400).json(createInvalidParameterError('Invalid supi format'));
  }

  if (!body || typeof body !== 'object') {
    return res.status(400).json(createInvalidParameterError('Request body must be a valid JSON object'));
  }

  const {
    req5gsLoc = false,
    reqCurrentLoc = false,
    reqRatType = false,
    reqTimeZone = false,
    reqServingNode = false,
    supportedFeatures
  } = body;

  const response: Partial<LocationInfoResult> = {};

  const anyFlagSet = req5gsLoc || reqCurrentLoc || reqRatType || reqTimeZone || reqServingNode;

  if (anyFlagSet) {
    const plmnId: PlmnId = {
      mcc: '001',
      mnc: '01'
    };
    response.vPlmnId = plmnId;

    if (req5gsLoc || reqCurrentLoc) {
      const ncgi: Ncgi = {
        plmnId,
        nrCellId: '000000001'
      };
      const tai: Tai = {
        plmnId,
        tac: '000001'
      };
      
      response.ncgi = ncgi;
      response.tai = tai;
      response.currentLoc = true;
    }

    if (reqServingNode) {
      response.amfInstanceId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    }

    if (reqRatType) {
      response.ratType = RatType.NR;
    }

    if (reqTimeZone) {
      response.timezone = '+00:00';
    }
  }

  if (supportedFeatures) {
    response.supportedFeatures = supportedFeatures;
  }

  res.status(200).json(response);
});

export default router;

