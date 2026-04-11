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
import { uploadListing } from '../config/cloudinary.js';
import { validateImageFiles } from '../middleware/upload.js';
import { listingValidation, idValidation, validate } from '../middleware/validation.js';
import { createListingLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// IMPORTANT: Specific routes BEFORE dynamic routes

// Public routes
router.get('/', auth, getAllListings);

// Protected routes - Must come BEFORE /:id
router.get('/my-listings', auth, getMyListings);

// Dynamic public route - Must be AFTER specific routes
router.get('/:id', auth, idValidation, validate, getListingById);

// Other protected routes
router.post(
  '/',
  auth,
  createListingLimiter,
  uploadListing.array('images', 5),
  validateImageFiles,
  listingValidation,
  validate,
  createListing
);

router.put(
  '/:id',
  auth,
  idValidation,
  validate,
  uploadListing.array('images', 5),
  updateListing,
);

router.delete('/:id', auth, idValidation, validate, deleteListing);
router.post('/:id/reactivate', auth, idValidation, validate, reactivateListing);

export default router;
