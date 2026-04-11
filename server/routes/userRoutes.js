import express from 'express';
import {
  updateProfile,
  changePassword,
  getUserProfile,
} from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import { uploadProfile } from '../config/cloudinary.js';
import {
  firebasePhoneVerificationValidation,
  updateProfileValidation,
  validate,
} from '../middleware/validation.js';
import { phoneVerificationLimiter, profileUpdateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(auth);

router.get('/profile', getUserProfile);
router.put('/change-password', changePassword);

router.put(
  '/profile',
  profileUpdateLimiter,
  uploadProfile.single('profilePicture'),
  updateProfileValidation,
  validate,
  updateProfile
);

export default router;
