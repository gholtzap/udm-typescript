import { Router, Request, Response } from 'express';

const router = Router();

const notImplemented = (req: Request, res: Response) => {
  res.status(501).json({
    title: 'Not Implemented',
    status: 501,
    detail: 'This endpoint is not yet implemented'
  });
};

router.post('/:supiOrSuci/security-information/generate-auth-data', notImplemented);

router.get('/:supiOrSuci/security-information-rg', notImplemented);

router.post('/:supi/auth-events', notImplemented);

router.post('/:supi/hss-security-information/:hssAuthType/generate-av', notImplemented);

router.put('/:supi/auth-events/:authEventId', notImplemented);

router.post('/:supi/gba-security-information/generate-av', notImplemented);

router.post('/:supiOrSuci/prose-security-information/generate-av', notImplemented);

export default router;

