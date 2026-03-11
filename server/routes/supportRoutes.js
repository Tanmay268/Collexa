import express from 'express';
import auth from '../middleware/auth.js';
import { requestSellerContact, submitAccountReport, submitBugReport } from '../controllers/supportController.js';
import { bugReportLimiter, contactRequestLimiter } from '../middleware/rateLimiter.js';
import { accountReportValidation, bugReportValidation, contactRequestValidation, validate } from '../middleware/validation.js';

const router = express.Router();

router.post('/bug-report', auth, bugReportLimiter, bugReportValidation, validate, submitBugReport);
router.post('/account-report', auth, bugReportLimiter, accountReportValidation, validate, submitAccountReport);
router.post('/contact-request', auth, contactRequestLimiter, contactRequestValidation, validate, requestSellerContact);

export default router;
