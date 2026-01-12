import express from 'express';
import { createReport, getMyReports } from '../controllers/reportController.js';
import auth from '../middleware/auth.js';
import { reportValidation, validate } from '../middleware/validation.js';
import { reportLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', auth, reportLimiter, reportValidation, validate, createReport);
router.get('/my-reports', auth, getMyReports);

export default router;
