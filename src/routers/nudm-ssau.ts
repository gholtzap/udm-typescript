import { Router, Request, Response } from 'express';

const router = Router();

const notImplemented = (req: Request, res: Response) => {
  res.status(501).json({
    title: 'Not Implemented',
    status: 501,
    detail: 'This endpoint is not yet implemented'
  });
};

router.post('/:ueIdentity/:serviceType/authorize', notImplemented);

router.post('/:ueIdentity/:serviceType/remove', notImplemented);

export default router;

