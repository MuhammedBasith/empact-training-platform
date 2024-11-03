// auth.routes.ts

import { Router } from 'express';
import { checkUserStatus, verifyController } from '../controllers/auth.controller';

const router = Router();

// Verify Token Route
router.post('/verify', verifyController);
router.get("/checkUserStatus", checkUserStatus);

export default router;
