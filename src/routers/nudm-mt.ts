import { Router, Request, Response } from 'express';

const router = Router();

const ueInfoStore = new Map<string, any>();

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
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid supi format',
      cause: 'INVALID_PARAMETER'
    });
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
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'fields parameter must contain at least one item',
      cause: 'INVALID_PARAMETER'
    });
  }

  let ueInfo = ueInfoStore.get(supi);
  
  if (!ueInfo) {
    ueInfo = {
      tadsInfo: {
        ueContextInfo: {
          supportVoPS: true,
          lastActTime: new Date().toISOString()
        }
      },
      userState: {
        accessType: '3GPP_ACCESS',
        registrationState: 'REGISTERED'
      },
      '5gSrvccInfo': {
        ue5GSrvccCapability: true,
        stnSr: '1234567890',
        cMsisdn: '0987654321'
      }
    };
    ueInfoStore.set(supi, ueInfo);
  }

  const response: any = {};
  
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
  const body = req.body;

  const supiPattern = /^(imsi-[0-9]{5,15}|nai-.+)$/;
  if (!supiPattern.test(supi)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid supi format',
      cause: 'INVALID_PARAMETER'
    });
  }

  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Request body must be a valid JSON object',
      cause: 'INVALID_PARAMETER'
    });
  }

  const {
    req5gsLoc = false,
    reqCurrentLoc = false,
    reqRatType = false,
    reqTimeZone = false,
    reqServingNode = false,
    supportedFeatures
  } = body;

  const response: any = {};

  if (req5gsLoc || reqCurrentLoc) {
    response.ncgi = {
      plmnId: {
        mcc: '001',
        mnc: '01'
      },
      nrCellId: '000000001'
    };
    response.tai = {
      plmnId: {
        mcc: '001',
        mnc: '01'
      },
      tac: '000001'
    };
    response.currentLoc = true;
  }

  if (reqServingNode) {
    response.amfInstanceId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    response.vPlmnId = {
      mcc: '001',
      mnc: '01'
    };
  }

  if (reqRatType) {
    response.ratType = 'NR';
  }

  if (reqTimeZone) {
    response.timezone = '+00:00';
  }

  if (supportedFeatures) {
    response.supportedFeatures = supportedFeatures;
  }

  res.status(200).json(response);
});

export default router;

