// auth.routes.ts

import { Router } from 'express';
import { checkUserStatus, verifyController, confirmNewPasswordController } from '../controllers/auth.controller';

const router = Router();

// Verify Token Route
router.post('/verify', verifyController);
router.get("/checkUserStatus", checkUserStatus);
router.post('/confirm-new-password', confirmNewPasswordController)

export default router;
