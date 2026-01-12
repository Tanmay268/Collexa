import express from 'express';
import {
  getAllUsers,
  getAllListingsAdmin,
  getAllReports,
  reviewReport,
  getDashboardStats,
} from '../controllers/adminController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

router.use(auth, admin);

router.get('/users', getAllUsers);
router.get('/listings', getAllListingsAdmin);
router.get('/reports', getAllReports);
router.put('/reports/:id/review', reviewReport);
router.get('/stats', getDashboardStats);

export default router;
