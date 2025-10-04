import { Router, Request, Response } from 'express';

const router = Router();

const ppDataStore = new Map<string, any>();
const vnGroupStore = new Map<string, any>();
const mbsGroupStore = new Map<string, any>();

const notImplemented = (req: Request, res: Response) => {
  res.status(501).json({
    title: 'Not Implemented',
    status: 501,
    detail: 'This endpoint is not yet implemented'
  });
};

router.get('/:ueId/pp-data', (req: Request, res: Response) => {
  const { ueId } = req.params;
  const afInstanceId = req.query['af-instance-id'];
  const mtcProviderInformation = req.query['mtc-provider-information'];
  const supportedFeatures = req.query['supported-features'];

  const ueIdPattern = /^(msisdn-[0-9]{5,15}|extid-[^@]+@[^@]+|imsi-[0-9]{5,15}|nai-.+|gci-.+|gli-.+|extgroupid-[^@]+@[^@]+)$/;
  if (!ueIdPattern.test(ueId)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid ueId format',
      cause: 'INVALID_PARAMETER'
    });
  }

  let ppData = ppDataStore.get(ueId);
  
  if (!ppData) {
    ppData = {
      communicationCharacteristics: {
        ppSubsRegTimer: {
          subsRegTimer: 3600,
          afInstanceId: afInstanceId || 'af-default',
          referenceId: 1
        },
        ppActiveTime: {
          activeTime: 300,
          afInstanceId: afInstanceId || 'af-default',
          referenceId: 2
        },
        ppDlPacketCount: 10
      },
      expectedUeBehaviourParameters: {
        afInstanceId: afInstanceId || 'af-default',
        referenceId: 3,
        stationaryIndication: 'STATIONARY',
        communicationDurationTime: 600,
        periodicTime: 3600
      },
      ecRestriction: {
        afInstanceId: afInstanceId || 'af-default',
        referenceId: 4,
        plmnEcInfos: [
          {
            plmnId: {
              mcc: '001',
              mnc: '01'
            },
            ecRestrictionDataNb: false
          }
        ]
      }
    };
    ppDataStore.set(ueId, ppData);
  }

  const response: any = { ...ppData };

  if (supportedFeatures) {
    response.supportedFeatures = supportedFeatures;
  }

  return res.status(200).json(response);
});

router.patch('/:ueId/pp-data', (req: Request, res: Response) => {
  const { ueId } = req.params;
  const afInstanceId = req.query['af-instance-id'];
  const mtcProviderInformation = req.query['mtc-provider-information'];
  const supportedFeatures = req.query['supported-features'];
  const body = req.body;

  const ueIdPattern = /^(msisdn-[0-9]{5,15}|extid-[^@]+@[^@]+|imsi-[0-9]{5,15}|nai-.+|gci-.+|gli-.+|extgroupid-[^@]+@[^@]+)$/;
  if (!ueIdPattern.test(ueId)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid ueId format',
      cause: 'INVALID_PARAMETER'
    });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Request body must be a valid JSON object',
      cause: 'INVALID_PARAMETER'
    });
  }

  let ppData = ppDataStore.get(ueId);
  
  if (!ppData) {
    ppData = {
      communicationCharacteristics: {
        ppSubsRegTimer: {
          subsRegTimer: 3600,
          afInstanceId: afInstanceId || 'af-default',
          referenceId: 1
        },
        ppActiveTime: {
          activeTime: 300,
          afInstanceId: afInstanceId || 'af-default',
          referenceId: 2
        },
        ppDlPacketCount: 10
      },
      expectedUeBehaviourParameters: {
        afInstanceId: afInstanceId || 'af-default',
        referenceId: 3,
        stationaryIndication: 'STATIONARY',
        communicationDurationTime: 600,
        periodicTime: 3600
      },
      ecRestriction: {
        afInstanceId: afInstanceId || 'af-default',
        referenceId: 4,
        plmnEcInfos: [
          {
            plmnId: {
              mcc: '001',
              mnc: '01'
            },
            ecRestrictionDataNb: false
          }
        ]
      }
    };
  }

  const deepMerge = (target: any, source: any): any => {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] === null) {
        delete result[key];
      } else if (typeof source[key] === 'object' && !Array.isArray(source[key]) && source[key] !== null) {
        if (typeof result[key] === 'object' && !Array.isArray(result[key]) && result[key] !== null) {
          result[key] = deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  };

  ppData = deepMerge(ppData, body);
  ppDataStore.set(ueId, ppData);

  return res.status(204).send();
});

router.put('/5g-vn-groups/:extGroupId', (req: Request, res: Response) => {
  const { extGroupId } = req.params;
  const body = req.body;

  const extGroupIdPattern = /^[^@]+@[^@]+$/;
  if (!extGroupIdPattern.test(extGroupId)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid extGroupId format',
      cause: 'INVALID_PARAMETER'
    });
  }

  if (body === undefined || body === null || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Request body must be a valid JSON object',
      cause: 'INVALID_PARAMETER'
    });
  }

  vnGroupStore.set(extGroupId, body);

  return res.status(201).send();
});

router.delete('/5g-vn-groups/:extGroupId', (req: Request, res: Response) => {
  const { extGroupId } = req.params;
  const mtcProviderInfo = req.query['mtc-provider-info'];
  const afId = req.query['af-id'];

  const extGroupIdPattern = /^[^@]+@[^@]+$/;
  if (!extGroupIdPattern.test(extGroupId)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid extGroupId format',
      cause: 'INVALID_PARAMETER'
    });
  }

  if (!vnGroupStore.has(extGroupId)) {
    return res.status(404).json({
      type: 'urn:3gpp:error:not-found',
      title: 'Not Found',
      status: 404,
      detail: '5G VN Group not found',
      cause: 'DATA_NOT_FOUND'
    });
  }

  vnGroupStore.delete(extGroupId);

  return res.status(204).send();
});

router.patch('/5g-vn-groups/:extGroupId', (req: Request, res: Response) => {
  const { extGroupId } = req.params;
  const supportedFeatures = req.query['supported-features'];
  const body = req.body;

  const extGroupIdPattern = /^[^@]+@[^@]+$/;
  if (!extGroupIdPattern.test(extGroupId)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid extGroupId format',
      cause: 'INVALID_PARAMETER'
    });
  }

  if (!vnGroupStore.has(extGroupId)) {
    return res.status(404).json({
      type: 'urn:3gpp:error:not-found',
      title: 'Not Found',
      status: 404,
      detail: '5G VN Group not found',
      cause: 'DATA_NOT_FOUND'
    });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Request body must be a valid JSON object',
      cause: 'INVALID_PARAMETER'
    });
  }

  let vnGroupConfig = vnGroupStore.get(extGroupId);

  const deepMerge = (target: any, source: any): any => {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] === null) {
        delete result[key];
      } else if (typeof source[key] === 'object' && !Array.isArray(source[key]) && source[key] !== null) {
        if (typeof result[key] === 'object' && !Array.isArray(result[key]) && result[key] !== null) {
          result[key] = deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  };

  vnGroupConfig = deepMerge(vnGroupConfig, body);
  vnGroupStore.set(extGroupId, vnGroupConfig);

  return res.status(204).send();
});

router.get('/5g-vn-groups/:extGroupId', (req: Request, res: Response) => {
  const { extGroupId } = req.params;

  const extGroupIdPattern = /^[^@]+@[^@]+$/;
  if (!extGroupIdPattern.test(extGroupId)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid extGroupId format',
      cause: 'INVALID_PARAMETER'
    });
  }

  if (!vnGroupStore.has(extGroupId)) {
    return res.status(404).json({
      type: 'urn:3gpp:error:not-found',
      title: 'Not Found',
      status: 404,
      detail: '5G VN Group not found',
      cause: 'DATA_NOT_FOUND'
    });
  }

  const vnGroupConfig = vnGroupStore.get(extGroupId);

  return res.status(200).json(vnGroupConfig);
});

router.put('/:ueId/pp-data-store/:afInstanceId', (req: Request, res: Response) => {
  const { ueId, afInstanceId } = req.params;
  const body = req.body;

  const ueIdPattern = /^(msisdn-[0-9]{5,15}|extid-[^@]+@[^@]+|imsi-[0-9]{5,15}|nai-.+|gci-.+|gli-.+|extgroupid-[^@]+@[^@]+|anyUE)$/;
  if (!ueIdPattern.test(ueId)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid ueId format',
      cause: 'INVALID_PARAMETER'
    });
  }

  if (!afInstanceId || typeof afInstanceId !== 'string' || afInstanceId.trim() === '') {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid afInstanceId',
      cause: 'INVALID_PARAMETER'
    });
  }

  if (body === undefined || body === null || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Request body must be a valid JSON object',
      cause: 'INVALID_PARAMETER'
    });
  }

  const storeKey = `${ueId}:${afInstanceId}`;
  const existingEntry = ppDataStore.get(storeKey);

  ppDataStore.set(storeKey, body);

  if (existingEntry) {
    return res.status(204).send();
  } else {
    return res.status(201).json(body);
  }
});

router.delete('/:ueId/pp-data-store/:afInstanceId', (req: Request, res: Response) => {
  const { ueId, afInstanceId } = req.params;
  const mtcProviderInformation = req.query['mtc-provider-information'];

  const ueIdPattern = /^(msisdn-[0-9]{5,15}|extid-[^@]+@[^@]+|imsi-[0-9]{5,15}|nai-.+|gci-.+|gli-.+|extgroupid-[^@]+@[^@]+|anyUE)$/;
  if (!ueIdPattern.test(ueId)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid ueId format',
      cause: 'INVALID_PARAMETER'
    });
  }

  if (!afInstanceId || typeof afInstanceId !== 'string' || afInstanceId.trim() === '') {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid afInstanceId',
      cause: 'INVALID_PARAMETER'
    });
  }

  const storeKey = `${ueId}:${afInstanceId}`;
  
  if (!ppDataStore.has(storeKey)) {
    return res.status(404).json({
      type: 'urn:3gpp:error:not-found',
      title: 'Not Found',
      status: 404,
      detail: 'PP Data Entry not found',
      cause: 'DATA_NOT_FOUND'
    });
  }

  ppDataStore.delete(storeKey);

  return res.status(204).send();
});

router.get('/:ueId/pp-data-store/:afInstanceId', (req: Request, res: Response) => {
  const { ueId, afInstanceId } = req.params;
  const mtcProviderInformation = req.query['mtc-provider-information'];
  const supportedFeatures = req.query['supported-features'];

  const ueIdPattern = /^(msisdn-[0-9]{5,15}|extid-[^@]+@[^@]+|imsi-[0-9]{5,15}|nai-.+|gci-.+|gli-.+|extgroupid-[^@]+@[^@]+|anyUE)$/;
  if (!ueIdPattern.test(ueId)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid ueId format',
      cause: 'INVALID_PARAMETER'
    });
  }

  if (!afInstanceId || typeof afInstanceId !== 'string' || afInstanceId.trim() === '') {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid afInstanceId',
      cause: 'INVALID_PARAMETER'
    });
  }

  const storeKey = `${ueId}:${afInstanceId}`;
  
  if (!ppDataStore.has(storeKey)) {
    return res.status(404).json({
      type: 'urn:3gpp:error:not-found',
      title: 'Not Found',
      status: 404,
      detail: 'PP Data Entry not found',
      cause: 'DATA_NOT_FOUND'
    });
  }

  const ppDataEntry = ppDataStore.get(storeKey);
  const response: any = { ...ppDataEntry };

  if (supportedFeatures) {
    response.supportedFeatures = supportedFeatures;
  }

  return res.status(200).json(response);
});

router.put('/mbs-group-membership/:extGroupId', (req: Request, res: Response) => {
  const { extGroupId } = req.params;
  const body = req.body;

  const extGroupIdPattern = /^[^@]+@[^@]+$/;
  if (!extGroupIdPattern.test(extGroupId)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid extGroupId format',
      cause: 'INVALID_PARAMETER'
    });
  }

  if (body === undefined || body === null || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Request body must be a valid JSON object',
      cause: 'INVALID_PARAMETER'
    });
  }

  if (!body.multicastGroupMemb || !Array.isArray(body.multicastGroupMemb) || body.multicastGroupMemb.length === 0) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'multicastGroupMemb is required and must be a non-empty array',
      cause: 'INVALID_PARAMETER'
    });
  }

  mbsGroupStore.set(extGroupId, body);

  return res.status(201).send();
});

router.delete('/mbs-group-membership/:extGroupId', (req: Request, res: Response) => {
  const { extGroupId } = req.params;

  const extGroupIdPattern = /^[^@]+@[^@]+$/;
  if (!extGroupIdPattern.test(extGroupId)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid extGroupId format',
      cause: 'INVALID_PARAMETER'
    });
  }

  if (!mbsGroupStore.has(extGroupId)) {
    return res.status(404).json({
      type: 'urn:3gpp:error:not-found',
      title: 'Not Found',
      status: 404,
      detail: '5G MBS Group not found',
      cause: 'DATA_NOT_FOUND'
    });
  }

  mbsGroupStore.delete(extGroupId);

  return res.status(204).send();
});

router.patch('/mbs-group-membership/:extGroupId', (req: Request, res: Response) => {
  const { extGroupId } = req.params;
  const supportedFeatures = req.query['supported-features'];
  const body = req.body;

  const extGroupIdPattern = /^[^@]+@[^@]+$/;
  if (!extGroupIdPattern.test(extGroupId)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid extGroupId format',
      cause: 'INVALID_PARAMETER'
    });
  }

  if (!mbsGroupStore.has(extGroupId)) {
    return res.status(404).json({
      type: 'urn:3gpp:error:not-found',
      title: 'Not Found',
      status: 404,
      detail: '5G MBS Group not found',
      cause: 'DATA_NOT_FOUND'
    });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Request body must be a valid JSON object',
      cause: 'INVALID_PARAMETER'
    });
  }

  let mbsGroupConfig = mbsGroupStore.get(extGroupId);

  const deepMerge = (target: any, source: any): any => {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] === null) {
        delete result[key];
      } else if (typeof source[key] === 'object' && !Array.isArray(source[key]) && source[key] !== null) {
        if (typeof result[key] === 'object' && !Array.isArray(result[key]) && result[key] !== null) {
          result[key] = deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  };

  mbsGroupConfig = deepMerge(mbsGroupConfig, body);
  mbsGroupStore.set(extGroupId, mbsGroupConfig);

  return res.status(204).send();
});

router.get('/mbs-group-membership/:extGroupId', (req: Request, res: Response) => {
  const { extGroupId } = req.params;

  const extGroupIdPattern = /^[^@]+@[^@]+$/;
  if (!extGroupIdPattern.test(extGroupId)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid extGroupId format',
      cause: 'INVALID_PARAMETER'
    });
  }

  if (!mbsGroupStore.has(extGroupId)) {
    return res.status(404).json({
      type: 'urn:3gpp:error:not-found',
      title: 'Not Found',
      status: 404,
      detail: '5G MBS Group not found',
      cause: 'DATA_NOT_FOUND'
    });
  }

  const mbsGroupConfig = mbsGroupStore.get(extGroupId);

  return res.status(200).json(mbsGroupConfig);
});

export default router;

