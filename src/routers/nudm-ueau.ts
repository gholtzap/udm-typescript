import { Router, Request, Response } from 'express';
import { getCollection } from '../db/mongodb';
import { 
  AuthenticationInfoRequest, 
  AuthenticationInfoResult, 
  AuthType, 
  AvType,
  Av5GHeAka
} from '../types/nudm-ueau-types';
import { createNotFoundError, createInvalidParameterError, suciPattern } from '../types/common-types';
import { 
  generateRand, 
  milenage, 
  computeKausf, 
  computeXresStar 
} from '../utils/auth-crypto';

const router = Router();

interface SubscriberData {
  _id?: string;
  supi: string;
  permanentKey: string;
  operatorKey: string;
  sequenceNumber: string;
  authenticationMethod: string;
  subscribedData?: {
    authenticationSubscription?: {
      authenticationMethod: string;
      permanentKey?: {
        permanentKeyValue: string;
      };
      sequenceNumber?: string;
      authenticationManagementField?: string;
      milenage?: {
        op?: {
          opValue: string;
        };
      };
    };
  };
}

const notImplemented = (req: Request, res: Response) => {
  res.status(501).json({
    title: 'Not Implemented',
    status: 501,
    detail: 'This endpoint is not yet implemented'
  });
};

router.post('/:supiOrSuci/security-information/generate-auth-data', async (req: Request, res: Response) => {
  const { supiOrSuci } = req.params;
  const authRequest: AuthenticationInfoRequest = req.body;

  if (!authRequest || typeof authRequest !== 'object') {
    return res.status(400).json(createInvalidParameterError('Request body must be a valid JSON object'));
  }

  if (!authRequest.servingNetworkName) {
    return res.status(400).json(createInvalidParameterError('servingNetworkName is required'));
  }

  if (!authRequest.ausfInstanceId) {
    return res.status(400).json(createInvalidParameterError('ausfInstanceId is required'));
  }

  let supi = supiOrSuci;
  
  if (suciPattern.test(supiOrSuci)) {
    return res.status(501).json({
      type: 'urn:3gpp:error:not-implemented',
      title: 'Not Implemented',
      status: 501,
      detail: 'SUCI de-concealment is not yet implemented'
    });
  }

  if (!supi.startsWith('imsi-')) {
    return res.status(400).json(createInvalidParameterError('Invalid SUPI format, must start with imsi-'));
  }

  const subscribersCollection = getCollection<SubscriberData>('subscribers');
  const subscriber = await subscribersCollection.findOne({ supi });

  if (!subscriber) {
    return res.status(404).json(createNotFoundError(`Subscriber with SUPI ${supi} not found`));
  }

  let permanentKey: string;
  let operatorKey: string;
  let sequenceNumber: string;
  let amf = '8000';

  if (subscriber.subscribedData?.authenticationSubscription) {
    const authSub = subscriber.subscribedData.authenticationSubscription;
    permanentKey = authSub.permanentKey?.permanentKeyValue || subscriber.permanentKey;
    operatorKey = authSub.milenage?.op?.opValue || subscriber.operatorKey;
    sequenceNumber = authSub.sequenceNumber || subscriber.sequenceNumber;
    amf = authSub.authenticationManagementField || '8000';
  } else {
    permanentKey = subscriber.permanentKey;
    operatorKey = subscriber.operatorKey;
    sequenceNumber = subscriber.sequenceNumber;
  }

  if (!permanentKey || !operatorKey || !sequenceNumber) {
    return res.status(500).json({
      type: 'urn:3gpp:error:internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'Missing authentication credentials for subscriber'
    });
  }

  const rand = generateRand();
  const randBuf = Buffer.from(rand, 'hex');
  const kBuf = Buffer.from(permanentKey, 'hex');
  const opBuf = Buffer.from(operatorKey, 'hex');
  const sqnBuf = Buffer.from(sequenceNumber, 'hex');
  const amfBuf = Buffer.from(amf, 'hex');

  const milenageOutput = milenage(kBuf, opBuf, randBuf, sqnBuf, amfBuf);

  const sqnXorAk = Buffer.alloc(6);
  for (let i = 0; i < 6; i++) {
    sqnXorAk[i] = sqnBuf[i] ^ milenageOutput.ak[i];
  }

  const autn = Buffer.concat([sqnXorAk, amfBuf, milenageOutput.mac_a]).toString('hex').toUpperCase();

  const kausf = computeKausf(
    milenageOutput.ck, 
    milenageOutput.ik, 
    authRequest.servingNetworkName, 
    sqnXorAk
  );

  const xresStar = computeXresStar(
    milenageOutput.res, 
    randBuf, 
    authRequest.servingNetworkName
  );

  const authVector: Av5GHeAka = {
    avType: AvType.FIVE_G_HE_AKA,
    rand: rand,
    xresStar: xresStar,
    autn: autn,
    kausf: kausf
  };

  const newSqnInt = parseInt(sequenceNumber, 16) + 1;
  const newSqn = newSqnInt.toString(16).padStart(12, '0').toUpperCase();
  
  if (subscriber.subscribedData?.authenticationSubscription) {
    await subscribersCollection.updateOne(
      { supi },
      { $set: { 'subscribedData.authenticationSubscription.sequenceNumber': newSqn } }
    );
  } else {
    await subscribersCollection.updateOne(
      { supi },
      { $set: { sequenceNumber: newSqn } }
    );
  }

  const authResult: AuthenticationInfoResult = {
    authType: AuthType.FIVE_G_AKA,
    authenticationVector: authVector,
    supi: supi
  };

  return res.status(200).json(authResult);
});

router.get('/:supiOrSuci/security-information-rg', notImplemented);

router.post('/:supi/auth-events', notImplemented);

router.post('/:supi/hss-security-information/:hssAuthType/generate-av', notImplemented);

router.put('/:supi/auth-events/:authEventId', notImplemented);

router.post('/:supi/gba-security-information/generate-av', notImplemented);

router.post('/:supiOrSuci/prose-security-information/generate-av', notImplemented);

export default router;

