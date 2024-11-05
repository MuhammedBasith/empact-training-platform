// auth.routes.ts

import { Router } from 'express';
import { checkUserStatus, verifyController, confirmNewPasswordController, signUpController, getUserDetails, getUserCognitoId } from '../controllers/auth.controller';

const router = Router();

// Verify Token Route
router.post('/verify', verifyController);
router.get("/checkUserStatus", checkUserStatus);
router.post('/confirm-new-password', confirmNewPasswordController)
router.post('/signup', signUpController);
router.get('/:cognitoId',getUserDetails);
router.get('getUserCognitoId/:email',getUserCognitoId)
export default router;
