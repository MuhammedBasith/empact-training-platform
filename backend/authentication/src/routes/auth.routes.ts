// auth.routes.ts

import { Router } from 'express';
import { verifyController } from '../controllers/auth.controller';

const router = Router();

// Verify Token Route
router.post('/verify', verifyController);

export default router;
