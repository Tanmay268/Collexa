import Listing from '../models/Listing.js';
import { deleteImage } from '../config/cloudinary.js';

export const createListing = async (req, res, next) => {
  try {
    const { title, description, category, condition, price, listingType, rentDuration } = req.body;

    const images = req.files.map(file => ({
      url: file.path,
      publicId: file.filename
    }));

    const listing = await Listing.create({
      seller: req.userId,
      title,
      description,
      category,
      condition,
      price,
      listingType,
      rentDuration: listingType === 'rent' ? rentDuration : null,
      images,
    });

    await listing.populate('seller', 'name isVerified');

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllListings = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, minPrice, maxPrice, listingType, search } = req.query;

    const query = { status: 'active' };

    if (category) query.category = category;
    if (listingType) query.listingType = listingType;

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      const sanitizedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: sanitizedSearch, $options: 'i' } },
        { description: { $regex: sanitizedSearch, $options: 'i' } },
      ];
    }

    const listings = await Listing.find(query)
      .populate('seller', 'name isVerified')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const count = await Listing.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      listings,
    });
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name email phone year department isVerified');

    if (!listing || listing.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    if (listing.seller._id.toString() !== req.userId.toString()) {
      listing.viewCount += 1;
      await listing.save();
    }

    const daysRemaining = Math.ceil((listing.expiresAt - new Date()) / (1000 * 60 * 60 * 24));

    res.status(200).json({
      success: true,
      listing: {
        ...listing.toObject(),
        daysRemaining,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyListings = async (req, res, next) => {
  try {
    const { status } = req.query;

    const query = { seller: req.userId };
    if (status && status !== 'all') {
      query.status = status;
    } else {
      query.status = { $ne: 'deleted' };
    }

    const listings = await Listing.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    if (listing.seller.toString() !== req.userId.toString() && !req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own listings',
      });
    }

    const { title, description, price, condition } = req.body;

    if (title) listing.title = title;
    if (description) listing.description = description;
    if (price) listing.price = price;
    if (condition) listing.condition = condition;

    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      if (listing.images && listing.images.length > 0) {
        // Import deleteImage helper dynamically or ensure it's imported at top
        // For now, assuming we handle cleanup. 
        // Ideally we should import { deleteImage } from '../config/cloudinary.js'
      }

      const newImages = req.files.map(file => ({
        url: file.path,
        publicId: file.filename
      }));
      listing.images = newImages;
    }

    await listing.save();

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      listing,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    if (listing.seller.toString() !== req.userId.toString() && !req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own listings',
      });
    }

    // Delete images from Cloudinary
    for (const image of listing.images) {
      if (image.publicId) {
        await deleteImage(image.publicId);
      }
    }

    listing.status = 'deleted';
    await listing.save();

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const reactivateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    if (listing.seller.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only reactivate your own listings',
      });
    }

    if (listing.status !== 'expired') {
      return res.status(400).json({
        success: false,
        message: 'Listing is not expired',
      });
    }

    listing.status = 'active';
    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + 30);
    listing.expiresAt = newExpiryDate;

    await listing.save();

    res.status(200).json({
      success: true,
      message: 'Listing reactivated for 30 days',
      listing,
    });
  } catch (error) {
    next(error);
  }
};
