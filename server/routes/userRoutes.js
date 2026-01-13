import express from 'express';
import { updateProfile, changePassword } from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import { uploadProfile } from '../config/cloudinary.js';
import {
    getUserProfile,
    updateUserProfile,
} from '../controllers/userController.js';

const router = express.Router();

router.use(auth);

router.get('/profile', getUserProfile);
router.put('/change-password', changePassword);

// Update profile with picture
router.put(
    '/profile',
    uploadProfile.single('profilePicture'),
    updateProfile // Note: User provided controller code might have 'updateUserProfile' vs 'updateProfile'. I need to standardize.
);

export default router;
