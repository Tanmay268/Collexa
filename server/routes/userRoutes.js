import express from 'express';
import { updateProfile, changePassword } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);

export default router;
