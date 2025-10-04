import { Router, Request, Response } from 'express';

const router = Router();

const authorizationStore = new Map<string, any>();

router.post('/:ueIdentity/authorize', (req: Request, res: Response) => {
  const { ueIdentity } = req.params;
  const body = req.body;

  const ueIdentityPattern = /^(msisdn-[0-9]{5,15}|extid-[^@]+@[^@]+|extgroupid-[^@]+@[^@]+)$/;
  if (!ueIdentityPattern.test(ueIdentity)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid ueIdentity format',
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

  const { snssai, dnn, mtcProviderInformation, authUpdateCallbackUri, afId, nefId, validityTime, contextInfo } = body;

  if (!snssai) {
    return res.status(400).json({
      type: 'urn:3gpp:error:missing-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Missing required field: snssai',
      cause: 'MANDATORY_IE_MISSING'
    });
  }

  if (!dnn) {
    return res.status(400).json({
      type: 'urn:3gpp:error:missing-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Missing required field: dnn',
      cause: 'MANDATORY_IE_MISSING'
    });
  }

  if (!mtcProviderInformation) {
    return res.status(400).json({
      type: 'urn:3gpp:error:missing-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Missing required field: mtcProviderInformation',
      cause: 'MANDATORY_IE_MISSING'
    });
  }

  if (!authUpdateCallbackUri) {
    return res.status(400).json({
      type: 'urn:3gpp:error:missing-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Missing required field: authUpdateCallbackUri',
      cause: 'MANDATORY_IE_MISSING'
    });
  }

  const supiMatch = ueIdentity.match(/^msisdn-([0-9]{5,15})$/);
  const supi = supiMatch ? `imsi-${supiMatch[1]}` : 'imsi-001010000000001';

  const authData = {
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

