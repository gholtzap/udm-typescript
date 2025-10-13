import { Router, Request, Response } from 'express';
import { getCollection } from '../db/mongodb';
import { DeconcealReqData, DeconcealRspData } from '../types/nudm-ueid-types';
import { Supi, suciPattern } from '../types/common-types';

const router = Router();

interface StoredUeIdentity {
  _id: string;
  supi: Supi;
  suci?: string;
}

interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail: string;
  cause?: string;
}

router.post('/deconceal', async (req: Request, res: Response) => {
  const reqData: DeconcealReqData = req.body;

  if (!reqData || !reqData.suci) {
    return res.status(400).json({
      type: 'urn:3gpp:error:missing-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Missing required parameter: suci',
      cause: 'MANDATORY_IE_MISSING'
    } as ProblemDetails);
  }

  const { suci } = reqData;

  if (!suciPattern.test(suci)) {
    return res.status(400).json({
      type: 'urn:3gpp:error:invalid-parameter',
      title: 'Bad Request',
      status: 400,
      detail: 'Invalid SUCI format',
      cause: 'INVALID_PARAMETER'
    } as ProblemDetails);
  }

  const suciParts = suci.split('-');
  const protectionScheme = parseInt(suciParts[4], 10);

  if (protectionScheme > 2) {
    return res.status(501).json({
      type: 'urn:3gpp:error:unsupported-protection-scheme',
      title: 'Not Implemented',
      status: 501,
      detail: 'Unsupported protection scheme',
      cause: 'UNSUPPORTED_PROTECTION_SCHEME'
    } as ProblemDetails);
  }

  try {
    const collection = getCollection<StoredUeIdentity>();
    
    const ueIdentity = await collection.findOne({ suci: suci });

    if (!ueIdentity) {
      return res.status(404).json({
        type: 'urn:3gpp:error:user-not-found',
        title: 'Not Found',
        status: 404,
        detail: 'User not found',
        cause: 'USER_NOT_FOUND'
      } as ProblemDetails);
    }

    const response: DeconcealRspData = {
      supi: ueIdentity.supi
    };

    res.status(200).json(response);

  } catch (error) {
    return res.status(500).json({
      type: 'urn:3gpp:error:internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'Internal server error occurred'
    } as ProblemDetails);
  }
});

export default router;

