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

// Protected routes (Move my-listings here to ensure it's evaluated before generic :id)
router.use('/my-listings', auth, getMyListings);

// Public routes
router.get('/', getAllListings);
router.get('/:id', mongoIdValidation, validate, getListingById);

// Other protected routes
router.use(auth);

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
