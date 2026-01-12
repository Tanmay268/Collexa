import express from 'express';
import {
  createListing,
  getAllListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
  reactivateListing,
} from '../controllers/listingController.js';
import auth from '../middleware/auth.js';
import upload, { validateImageFiles } from '../middleware/upload.js';
import { listingValidation, mongoIdValidation, validate } from '../middleware/validation.js';
import { createListingLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', getAllListings);
router.get('/my-listings', auth, getMyListings);
router.get('/:id', mongoIdValidation, validate, auth, getListingById);
router.post('/', auth, createListingLimiter, upload.array('images', 5), validateImageFiles, listingValidation, validate, createListing);
router.put('/:id', mongoIdValidation, validate, auth, upload.array('images', 5), updateListing);
router.delete('/:id', mongoIdValidation, validate, auth, deleteListing);
router.post('/:id/reactivate', mongoIdValidation, validate, auth, reactivateListing);

export default router;
