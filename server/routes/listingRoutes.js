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
import { validateImageFiles } from '../middleware/upload.js'; // We might need to adjust this
import { listingValidation, mongoIdValidation, validate } from '../middleware/validation.js';
import { createListingLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.get('/', getAllListings);
router.get('/:id', mongoIdValidation, validate, getListingById);

// Protected routes
router.use(auth); // Apply auth middleware to all subsequent routes

router.get('/my-listings/all', getMyListings); // Changed path to avoid conflict with /:id if not careful, but /my-listings is specific enough

router.post(
  '/',
  createListingLimiter,
  uploadListing.array('images', 5),
  validateImageFiles, // Need to update this middleware to work with Cloudinary or remove if handled by multer filter
  listingValidation,
  validate,
  createListing
);

router.put(
  '/:id',
  mongoIdValidation,
  validate,
  uploadListing.array('images', 5),
  updateListing
);

router.delete('/:id', mongoIdValidation, validate, deleteListing);
router.post('/:id/reactivate', mongoIdValidation, validate, reactivateListing);

export default router;
