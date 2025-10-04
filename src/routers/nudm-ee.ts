import { Router, Request, Response } from 'express';

const router = Router();

const notImplemented = (req: Request, res: Response) => {
  res.status(501).json({
    title: 'Not Implemented',
    status: 501,
    detail: 'This endpoint is not yet implemented'
  });
};

router.post('/:ueIdentity/ee-subscriptions', notImplemented);

router.delete('/:ueIdentity/ee-subscriptions/:subscriptionId', notImplemented);

router.patch('/:ueIdentity/ee-subscriptions/:subscriptionId', notImplemented);

export default router;

