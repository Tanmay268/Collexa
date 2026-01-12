import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Report from '../models/Report.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    const count = await User.countDocuments();
    
    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllListingsAdmin = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    
    const query = status && status !== 'all' ? { status } : {};
    
    const listings = await Listing.find(query)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    const count = await Listing.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count,
      listings,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReports = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    
    const query = status && status !== 'all' ? { status } : {};
    
    const reports = await Report.find(query)
      .populate('listing', 'title seller')
      .populate('reportedBy', 'name email')
      .populate('listing.seller', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    const count = await Report.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

export const reviewReport = async (req, res, next) => {
  try {
    const { action, reviewNote, deleteListingIfActionTaken } = req.body;
    
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }
    
    report.status = action;
    report.reviewedBy = req.userId;
    report.reviewNote = reviewNote || '';
    report.reviewedAt = new Date();
    
    await report.save();
    
    if (action === 'action_taken' && deleteListingIfActionTaken) {
      await Listing.findByIdAndUpdate(report.listing, { status: 'deleted' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Report reviewed successfully',
      report,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const totalListings = await Listing.countDocuments();
    const activeListings = await Listing.countDocuments({ status: 'active' });
    const expiredListings = await Listing.countDocuments({ status: 'expired' });
    const deletedListings = await Listing.countDocuments({ status: 'deleted' });
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const totalReports = await Report.countDocuments();
    
    const listingsByCategory = await Listing.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    
    const categoryMap = {};
    listingsByCategory.forEach(item => {
      categoryMap[item._id] = item.count;
    });
    
    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        verifiedUsers,
        totalListings,
        activeListings,
        expiredListings,
        deletedListings,
        pendingReports,
        totalReports,
        listingsByCategory: categoryMap,
      },
    });
  } catch (error) {
    next(error);
  }
};
