import express from 'express';
import auth from '../middleware/auth.js';
import { submitBugReport } from '../controllers/supportController.js';
import { bugReportLimiter } from '../middleware/rateLimiter.js';
import { bugReportValidation, validate } from '../middleware/validation.js';

const router = express.Router();

router.post('/bug-report', auth, bugReportLimiter, bugReportValidation, validate, submitBugReport);

export default router;
