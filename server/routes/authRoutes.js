import express from 'express';
import {
  signup,
  verifyOTP,
  login,
  getCurrentUser,
  resendOTP,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import {
  signupValidation,
  loginValidation,
  otpValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  validate,
} from '../middleware/validation.js';
import { authLimiter, otpLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/signup', otpLimiter, signupValidation, validate, signup);
router.post('/verify-otp', otpValidation, validate, verifyOTP);
router.post('/login', authLimiter, loginValidation, validate, login);
router.get('/me', auth, getCurrentUser);
router.post('/resend-otp', otpLimiter, resendOTP);
router.post('/forgot-password', otpLimiter, forgotPasswordValidation, validate, forgotPassword);
router.post('/reset-password', otpLimiter, resetPasswordValidation, validate, resetPassword);

export default router;
