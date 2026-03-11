import { deleteImage } from '../config/cloudinary.js';
import {
  createListingRecord,
  getListingById as getListingRecordById,
  getUserById,
  incrementListingViewCount,
  paginate,
  syncExpiredListings,
  updateListingRecord,
} from '../services/dataService.js';

const withSeller = async (listing, includePrivateSellerFields = false) => {
  const seller = await getUserById(listing.sellerId);
  if (!seller) return { ...listing, seller: null };

  return {
    ...listing,
    seller: includePrivateSellerFields
      ? {
          _id: seller._id,
          id: seller._id,
          name: seller.name,
          email: seller.email,
          phone: seller.phone || null,
          year: seller.year || null,
          department: seller.department || null,
          isVerified: seller.isVerified,
        }
      : {
          _id: seller._id,
          id: seller._id,
          name: seller.name,
          isVerified: seller.isVerified,
        },
  };
};

const filterListings = (listings, query) => {
  const { category, minPrice, maxPrice, listingType, search, sellerId, status } = query;
  const normalizedSearch = search ? search.toLowerCase() : null;

  return listings.filter((listing) => {
    if (sellerId && listing.sellerId !== sellerId) return false;
    if (status === 'active' && listing.status !== 'active') return false;
    if (status && status !== 'all' && status !== 'active' && listing.status !== status) return false;
    if (!status && listing.status !== 'active') return false;
    if (category && listing.category !== category) return false;
    if (listingType && listing.listingType !== listingType) return false;
    if (minPrice !== undefined && Number(listing.price) < Number(minPrice)) return false;
    if (maxPrice !== undefined && Number(listing.price) > Number(maxPrice)) return false;
    if (
      normalizedSearch &&
      !`${listing.title} ${listing.description}`.toLowerCase().includes(normalizedSearch)
    ) {
      return false;
    }
    return true;
  });
};

export const createListing = async (req, res, next) => {
  try {
    const { title, description, category, condition, price, listingType, rentDuration } = req.body;

    const images = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    const listing = await createListingRecord({
      sellerId: req.userId,
      title,
      description,
      category,
      condition,
      price: Number(price),
      listingType,
      rentDuration: listingType === 'rent' ? rentDuration : null,
      images,
    });

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing: await withSeller(listing),
    });
  } catch (error) {
    next(error);
  }
};

export const getAllListings = async (req, res, next) => {
  try {
    const syncedListings = await syncExpiredListings();
    const filteredListings = filterListings(syncedListings, { ...req.query, status: 'active' });
    const page = paginate(filteredListings, req.query.page, req.query.limit);
    const listings = await Promise.all(page.items.map((listing) => withSeller(listing)));

    res.status(200).json({
      success: true,
      count: page.total,
      totalPages: page.totalPages,
      currentPage: page.currentPage,
      listings,
    });
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (req, res, next) => {
  try {
    let listing = await getListingRecordById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    if (listing.status === 'active' && new Date(listing.expiresAt) < new Date()) {
      listing = await updateListingRecord(listing._id, { status: 'expired' });
    }

    if (listing.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    if (!req.userId || listing.sellerId !== req.userId) {
      await incrementListingViewCount(listing._id);
      listing.viewCount += 1;
    }

    const daysRemaining = Math.max(
      0,
      Math.ceil((new Date(listing.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
    );

    res.status(200).json({
      success: true,
      listing: {
        ...(await withSeller(listing, true)),
        daysRemaining,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyListings = async (req, res, next) => {
  try {
    const syncedListings = await syncExpiredListings();
    const filteredListings = filterListings(syncedListings, {
      sellerId: req.userId,
      status: req.query.status || 'all',
    }).filter((listing) => listing.status !== 'deleted' || req.query.status === 'deleted');

    res.status(200).json({
      success: true,
      count: filteredListings.length,
      listings: filteredListings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await getListingRecordById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    if (listing.sellerId !== req.userId && !req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own listings',
      });
    }

    const { title, description, price, condition } = req.body;
    const nextPayload = {
      title,
      description,
      price: price !== undefined ? Number(price) : undefined,
      condition,
    };

    if (req.files && req.files.length > 0) {
      if (listing.images?.length) {
        await Promise.all(
          listing.images
            .filter((image) => image.publicId)
            .map((image) => deleteImage(image.publicId))
        );
      }

      nextPayload.images = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));
    }

    const updatedListing = await updateListingRecord(listing._id, nextPayload);

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      listing: updatedListing,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await getListingRecordById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    if (listing.sellerId !== req.userId && !req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own listings',
      });
    }

    await Promise.all(
      (listing.images || [])
        .filter((image) => image.publicId)
        .map((image) => deleteImage(image.publicId))
    );

    await updateListingRecord(listing._id, { status: 'deleted' });

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
    const listing = await getListingRecordById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    if (listing.sellerId !== req.userId) {
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

    const reactivatedListing = await updateListingRecord(listing._id, {
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      success: true,
      message: 'Listing reactivated for 30 days',
      listing: reactivatedListing,
    });
  } catch (error) {
    next(error);
  }
};
