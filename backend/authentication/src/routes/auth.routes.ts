// auth.routes.ts

import { Router } from 'express';
import { signupController, loginController, verifyController } from '../controllers/auth.controller';

const router = Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/verify', verifyController);

export default router;
