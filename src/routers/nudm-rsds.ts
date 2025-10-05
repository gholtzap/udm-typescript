import { Router, Request, Response } from 'express';
import { SmDeliveryStatus } from '../types/nudm-rsds-types';
import { validateUeIdentity, createInvalidParameterError } from '../types/common-types';

const router = Router();

const smDeliveryStatusStore = new Map<string, SmDeliveryStatus>();

router.post('/:ueIdentity/sm-delivery-status', (req: Request, res: Response) => {
  const { ueIdentity } = req.params;
  const body = req.body as SmDeliveryStatus;

  if (!validateUeIdentity(ueIdentity, ['msisdn', 'extid', 'extgroupid'], true)) {
    return res.status(400).json(createInvalidParameterError('Invalid ueIdentity format'));
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json(createInvalidParameterError('Request body must be a valid JSON object'));
  }

  if (!body.gpsi || typeof body.gpsi !== 'string' || body.gpsi.trim() === '') {
    return res.status(400).json(createInvalidParameterError('gpsi is required and must be a string'));
  }

  if (!body.smStatusReport || typeof body.smStatusReport !== 'string' || body.smStatusReport.trim() === '') {
    return res.status(400).json(createInvalidParameterError('smStatusReport is required and must be a string'));
  }

  smDeliveryStatusStore.set(ueIdentity, body);

  return res.status(204).send();
});

export default router;

