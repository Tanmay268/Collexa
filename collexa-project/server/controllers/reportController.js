import Report from '../models/Report.js';
import Listing from '../models/Listing.js';

export const createReport = async (req, res, next) => {
  try {
    const { listingId, reason, description } = req.body;
    
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }
    
    const report = await Report.create({
      listing: listingId,
      reportedBy: req.userId,
      reason,
      description: description || '',
    });
    
    listing.reportCount += 1;
    await listing.save();
    
    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Admin will review it.',
      report,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already reported this listing',
      });
    }
    next(error);
  }
};

export const getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ reportedBy: req.userId })
      .populate('listing', 'title status')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    next(error);
  }
};
