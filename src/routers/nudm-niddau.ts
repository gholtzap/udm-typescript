import { Router, Request, Response } from 'express';
import { AuthorizationInfo, AuthorizationData } from '../types/nudm-niddau-types';
import { validateUeIdentity, createInvalidParameterError, createMissingParameterError } from '../types/common-types';

const router = Router();

const authorizationStore = new Map<string, any>();

router.post('/:ueIdentity/authorize', (req: Request<{ ueIdentity: string }, any, AuthorizationInfo>, res: Response) => {
  const { ueIdentity } = req.params;
  const body = req.body;

  if (!validateUeIdentity(ueIdentity, ['msisdn', 'extid', 'extgroupid'])) {
    return res.status(400).json(createInvalidParameterError('Invalid ueIdentity format') as any);
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json(createInvalidParameterError('Request body must be a valid JSON object') as any);
  }

  const { snssai, dnn, mtcProviderInformation, authUpdateCallbackUri, afId, nefId, validityTime, contextInfo } = body;

  if (!snssai) {
    return res.status(400).json(createMissingParameterError('Missing required field: snssai') as any);
  }

  if (!dnn) {
    return res.status(400).json(createMissingParameterError('Missing required field: dnn') as any);
  }

  if (!mtcProviderInformation) {
    return res.status(400).json(createMissingParameterError('Missing required field: mtcProviderInformation') as any);
  }

  if (!authUpdateCallbackUri) {
    return res.status(400).json(createMissingParameterError('Missing required field: authUpdateCallbackUri') as any);
  }

  const supiMatch = ueIdentity.match(/^msisdn-([0-9]{5,15})$/);
  const supi = supiMatch ? `imsi-${supiMatch[1]}` : 'imsi-001010000000001';

  const authData: AuthorizationData = {
    authorizationData: [
      {
        supi: supi,
        gpsi: ueIdentity.startsWith('msisdn-') ? ueIdentity : `msisdn-${ueIdentity}`,
        validityTime: validityTime || new Date(Date.now() + 86400000).toISOString()
      }
    ],
    validityTime: validityTime || new Date(Date.now() + 86400000).toISOString()
  };

  authorizationStore.set(ueIdentity, {
    snssai,
    dnn,
    mtcProviderInformation,
    authUpdateCallbackUri,
    afId,
    nefId,
    contextInfo,
    authData
  });

  res.status(200).json(authData);
});

export default router;

