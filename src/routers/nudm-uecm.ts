import { Router, Request, Response } from 'express';

const router = Router();

const notImplemented = (req: Request, res: Response) => {
  res.status(501).json({
    title: 'Not Implemented',
    status: 501,
    detail: 'This endpoint is not yet implemented'
  });
};

router.get('/:ueId/registrations', notImplemented);

router.post('/:ueId/registrations/send-routing-info-sm', notImplemented);

router.put('/:ueId/registrations/amf-3gpp-access', notImplemented);

router.patch('/:ueId/registrations/amf-3gpp-access', notImplemented);

router.get('/:ueId/registrations/amf-3gpp-access', notImplemented);

router.post('/:ueId/registrations/amf-3gpp-access/dereg-amf', notImplemented);

router.post('/:ueId/registrations/amf-3gpp-access/pei-update', notImplemented);

router.post('/:ueId/registrations/amf-3gpp-access/roaming-info-update', notImplemented);

router.put('/:ueId/registrations/amf-non-3gpp-access', notImplemented);

router.patch('/:ueId/registrations/amf-non-3gpp-access', notImplemented);

router.get('/:ueId/registrations/amf-non-3gpp-access', notImplemented);

router.get('/:ueId/registrations/smf-registrations', notImplemented);

router.put('/:ueId/registrations/smf-registrations/:pduSessionId', notImplemented);

router.delete('/:ueId/registrations/smf-registrations/:pduSessionId', notImplemented);

router.get('/:ueId/registrations/smf-registrations/:pduSessionId', notImplemented);

router.patch('/:ueId/registrations/smf-registrations/:pduSessionId', notImplemented);

router.put('/:ueId/registrations/smsf-3gpp-access', notImplemented);

router.delete('/:ueId/registrations/smsf-3gpp-access', notImplemented);

router.get('/:ueId/registrations/smsf-3gpp-access', notImplemented);

router.patch('/:ueId/registrations/smsf-3gpp-access', notImplemented);

router.put('/:ueId/registrations/smsf-non-3gpp-access', notImplemented);

router.delete('/:ueId/registrations/smsf-non-3gpp-access', notImplemented);

router.get('/:ueId/registrations/smsf-non-3gpp-access', notImplemented);

router.patch('/:ueId/registrations/smsf-non-3gpp-access', notImplemented);

router.put('/:ueId/registrations/ip-sm-gw', notImplemented);

router.delete('/:ueId/registrations/ip-sm-gw', notImplemented);

router.get('/:ueId/registrations/ip-sm-gw', notImplemented);

router.post('/restore-pcscf', notImplemented);

router.get('/:ueId/registrations/location', notImplemented);

router.get('/:ueId/registrations/nwdaf-registrations', notImplemented);

router.put('/:ueId/registrations/nwdaf-registrations/:nwdafRegistrationId', notImplemented);

router.delete('/:ueId/registrations/nwdaf-registrations/:nwdafRegistrationId', notImplemented);

router.patch('/:ueId/registrations/nwdaf-registrations/:nwdafRegistrationId', notImplemented);

router.get('/:ueId/registrations/trigger-auth', notImplemented);

export default router;

