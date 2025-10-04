import { Router, Request, Response } from 'express';

const router = Router();

const notImplemented = (req: Request, res: Response) => {
  res.status(501).json({
    title: 'Not Implemented',
    status: 501,
    detail: 'This endpoint is not yet implemented'
  });
};

router.get('/:supi', notImplemented);

router.get('/:supi/nssai', notImplemented);

router.get('/:supi/ue-context-in-amf-data', notImplemented);

router.get('/:supi/am-data', notImplemented);

router.get('/:supi/am-data/ecr-data', notImplemented);

router.get('/:supi/smf-select-data', notImplemented);

router.get('/:supi/ue-context-in-smf-data', notImplemented);

router.get('/:supi/ue-context-in-smsf-data', notImplemented);

router.get('/:supi/trace-data', notImplemented);

router.get('/:supi/sm-data', notImplemented);

router.get('/:supi/sms-data', notImplemented);

router.get('/:supi/sms-mng-data', notImplemented);

router.get('/:ueId/lcs-privacy-data', notImplemented);

router.get('/:supi/lcs-mo-data', notImplemented);

router.get('/:supi/lcs-bca-data', notImplemented);

router.get('/:supi/lcs-subscription-data', notImplemented);

router.get('/:supi/v2x-data', notImplemented);

router.get('/:supi/prose-data', notImplemented);

router.get('/:supi/5mbs-data', notImplemented);

router.get('/:supi/uc-data', notImplemented);

router.post('/:ueId/sdm-subscriptions', notImplemented);

router.delete('/:ueId/sdm-subscriptions/:subscriptionId', notImplemented);

router.patch('/:ueId/sdm-subscriptions/:subscriptionId', notImplemented);

router.get('/:ueId/id-translation-result', notImplemented);

router.put('/:supi/am-data/sor-ack', notImplemented);

router.put('/:supi/am-data/upu-ack', notImplemented);

router.put('/:supi/am-data/subscribed-snssais-ack', notImplemented);

router.put('/:supi/am-data/cag-ack', notImplemented);

router.post('/:supi/am-data/update-sor', notImplemented);

router.get('/shared-data', notImplemented);

router.post('/shared-data-subscriptions', notImplemented);

router.delete('/shared-data-subscriptions/:subscriptionId', notImplemented);

router.patch('/shared-data-subscriptions/:subscriptionId', notImplemented);

router.get('/group-data/group-identifiers', notImplemented);

router.get('/shared-data/:sharedDataId', notImplemented);

router.get('/multiple-identifiers', notImplemented);

router.get('/:supi/time-sync-data', notImplemented);

router.get('/:supi/ranging-slpos-data', notImplemented);

router.get('/:supi/a2x-data', notImplemented);

router.get('/:ueId/rangingsl-privacy-data', notImplemented);

export default router;

