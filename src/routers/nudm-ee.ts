import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';

const router = Router();

const subscriptions = new Map<string, any>();

const notImplemented = (req: Request, res: Response) => {
  res.status(501).json({
    title: 'Not Implemented',
    status: 501,
    detail: 'This endpoint is not yet implemented'
  });
};

router.post('/:ueIdentity/ee-subscriptions', (req: Request, res: Response) => {
  const { ueIdentity } = req.params;
  const eeSubscription = req.body;

  const ueIdentityPattern = /^(msisdn-[0-9]{5,15}|extid-[^@]+@[^@]+|imsi-[0-9]{5,15}|nai-.+|gci-.+|gli-.+|extgroupid-[^@]+@[^@]+|anyUE)$/;
  if (!ueIdentityPattern.test(ueIdentity)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid ueIdentity format',
      cause: 'INVALID_PARAMETER'
    });
  }

  if (!eeSubscription.callbackReference) {
    return res.status(400).json({
      type: 'urn:3gpp:error:missing-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Missing required field: callbackReference',
      cause: 'MANDATORY_IE_MISSING'
    });
  }

  if (!eeSubscription.monitoringConfigurations || 
      Object.keys(eeSubscription.monitoringConfigurations).length === 0) {
    return res.status(400).json({
      type: 'urn:3gpp:error:missing-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Missing or empty required field: monitoringConfigurations',
      cause: 'MANDATORY_IE_MISSING'
    });
  }

  const subscriptionId = randomUUID();
  
  eeSubscription.subscriptionId = subscriptionId;

  const key = `${ueIdentity}:${subscriptionId}`;
  subscriptions.set(key, eeSubscription);

  const location = `/nudm-ee/v1/${ueIdentity}/ee-subscriptions/${subscriptionId}`;

  const response = {
    eeSubscription: eeSubscription
  };

  res.status(201)
    .header('Location', location)
    .json(response);
});

router.delete('/:ueIdentity/ee-subscriptions/:subscriptionId', (req: Request, res: Response) => {
  const { ueIdentity, subscriptionId } = req.params;

  const ueIdentityPattern = /^(msisdn-[0-9]{5,15}|extid-[^@]+@[^@]+|imsi-[0-9]{5,15}|nai-.+|gci-.+|gli-.+|extgroupid-[^@]+@[^@]+|anyUE)$/;
  if (!ueIdentityPattern.test(ueIdentity)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid ueIdentity format',
      cause: 'INVALID_PARAMETER'
    });
  }

  const key = `${ueIdentity}:${subscriptionId}`;
  
  if (!subscriptions.has(key)) {
    return res.status(404).json({
      type: 'urn:3gpp:error:not-found',
      title: 'Not Found',
      status: 404,
      detail: 'Subscription not found'
    });
  }

  subscriptions.delete(key);
  
  res.status(204).send();
});

router.patch('/:ueIdentity/ee-subscriptions/:subscriptionId', (req: Request, res: Response) => {
  const { ueIdentity, subscriptionId } = req.params;
  const patchOperations = req.body;

  const ueIdentityPattern = /^(msisdn-[0-9]{5,15}|extid-[^@]+@[^@]+|imsi-[0-9]{5,15}|nai-.+|gci-.+|gli-.+|extgroupid-[^@]+@[^@]+|anyUE)$/;
  if (!ueIdentityPattern.test(ueIdentity)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid ueIdentity format',
      cause: 'INVALID_PARAMETER'
    });
  }

  const key = `${ueIdentity}:${subscriptionId}`;
  
  if (!subscriptions.has(key)) {
    return res.status(404).json({
      type: 'urn:3gpp:error:not-found',
      title: 'Not Found',
      status: 404,
      detail: 'Subscription not found'
    });
  }

  if (!Array.isArray(patchOperations) || patchOperations.length === 0) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Request body must be a non-empty array of patch operations',
      cause: 'INVALID_PARAMETER'
    });
  }

  const subscription = subscriptions.get(key);
  const failedOperations: any[] = [];

  for (let i = 0; i < patchOperations.length; i++) {
    const operation = patchOperations[i];
    
    if (!operation.op || !operation.path) {
      failedOperations.push({
        op: operation.op,
        path: operation.path,
        value: operation.value,
        originalError: {
          title: 'Bad Request',
          status: 400,
          detail: 'Missing required fields in patch operation'
        }
      });
      continue;
    }

    try {
      applyPatchOperation(subscription, operation);
    } catch (error: any) {
      failedOperations.push({
        op: operation.op,
        path: operation.path,
        value: operation.value,
        originalError: {
          title: 'Bad Request',
          status: 400,
          detail: error.message || 'Failed to apply patch operation'
        }
      });
    }
  }

  subscriptions.set(key, subscription);

  if (failedOperations.length > 0) {
    return res.status(200).json({
      report: failedOperations.map(op => ({
        op: op.op,
        path: op.path,
        value: op.value,
        originalError: op.originalError
      }))
    });
  }

  res.status(204).send();
});

function applyPatchOperation(obj: any, operation: any): void {
  const { op, path, value, from } = operation;
  const pathParts = path.split('/').filter((p: string) => p);

  switch (op) {
    case 'add':
      setValueAtPath(obj, pathParts, value, true);
      break;
    case 'remove':
      removeValueAtPath(obj, pathParts);
      break;
    case 'replace':
      setValueAtPath(obj, pathParts, value, false);
      break;
    case 'move':
      if (!from) throw new Error('Move operation requires "from" field');
      const fromParts = from.split('/').filter((p: string) => p);
      const movedValue = getValueAtPath(obj, fromParts);
      removeValueAtPath(obj, fromParts);
      setValueAtPath(obj, pathParts, movedValue, true);
      break;
    case 'copy':
      if (!from) throw new Error('Copy operation requires "from" field');
      const fromPartsCopy = from.split('/').filter((p: string) => p);
      const copiedValue = getValueAtPath(obj, fromPartsCopy);
      setValueAtPath(obj, pathParts, copiedValue, true);
      break;
    case 'test':
      const currentValue = getValueAtPath(obj, pathParts);
      if (JSON.stringify(currentValue) !== JSON.stringify(value)) {
        throw new Error('Test operation failed: value does not match');
      }
      break;
    default:
      throw new Error(`Unsupported operation: ${op}`);
  }
}

function getValueAtPath(obj: any, pathParts: string[]): any {
  let current = obj;
  for (const part of pathParts) {
    if (current === null || current === undefined) {
      throw new Error(`Path not found: ${pathParts.join('/')}`);
    }
    current = current[part];
  }
  return current;
}

function setValueAtPath(obj: any, pathParts: string[], value: any, allowCreate: boolean): void {
  if (pathParts.length === 0) {
    throw new Error('Cannot set root object');
  }

  let current = obj;
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (!(part in current)) {
      if (allowCreate) {
        current[part] = {};
      } else {
        throw new Error(`Path not found: ${pathParts.slice(0, i + 1).join('/')}`);
      }
    }
    current = current[part];
  }

  const lastPart = pathParts[pathParts.length - 1];
  if (!allowCreate && !(lastPart in current)) {
    throw new Error(`Path not found: ${pathParts.join('/')}`);
  }
  
  current[lastPart] = value;
}

function removeValueAtPath(obj: any, pathParts: string[]): void {
  if (pathParts.length === 0) {
    throw new Error('Cannot remove root object');
  }

  let current = obj;
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (!(part in current)) {
      throw new Error(`Path not found: ${pathParts.slice(0, i + 1).join('/')}`);
    }
    current = current[part];
  }

  const lastPart = pathParts[pathParts.length - 1];
  if (!(lastPart in current)) {
    throw new Error(`Path not found: ${pathParts.join('/')}`);
  }
  
  delete current[lastPart];
}

export default router;

