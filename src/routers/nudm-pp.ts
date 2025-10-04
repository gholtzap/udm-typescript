import { Router, Request, Response } from 'express';

const router = Router();

const notImplemented = (req: Request, res: Response) => {
  res.status(501).json({
    title: 'Not Implemented',
    status: 501,
    detail: 'This endpoint is not yet implemented'
  });
};

router.get('/:ueId/pp-data', notImplemented);

router.patch('/:ueId/pp-data', notImplemented);

router.put('/5g-vn-groups/:extGroupId', notImplemented);

router.delete('/5g-vn-groups/:extGroupId', notImplemented);

router.patch('/5g-vn-groups/:extGroupId', notImplemented);

router.get('/5g-vn-groups/:extGroupId', notImplemented);

router.put('/:ueId/pp-data-store/:afInstanceId', notImplemented);

router.delete('/:ueId/pp-data-store/:afInstanceId', notImplemented);

router.get('/:ueId/pp-data-store/:afInstanceId', notImplemented);

router.put('/mbs-group-membership/:extGroupId', notImplemented);

router.delete('/mbs-group-membership/:extGroupId', notImplemented);

router.patch('/mbs-group-membership/:extGroupId', notImplemented);

router.get('/mbs-group-membership/:extGroupId', notImplemented);

export default router;

