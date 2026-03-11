import { getListingById, getUserById } from '../services/dataService.js';
import { sendAccountReportEmail, sendBugReportEmail, sendContactRequestEmail } from '../utils/sendEmail.js';

export const submitBugReport = async (req, res, next) => {
  try {
    const { title, description, pageUrl, deviceInfo } = req.body;

    const sent = await sendBugReportEmail({
      companyEmail: process.env.COMPANY_EMAIL || process.env.EMAIL_USER,
      reporter: {
        id: req.user?._id || req.userId,
        name: req.user?.name || 'Unknown User',
        email: req.user?.email || 'unknown@example.com',
      },
      report: {
        title,
        description,
        pageUrl: pageUrl || 'Not provided',
        deviceInfo: deviceInfo || 'Not provided',
      },
    });

    if (!sent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to submit bug report. Please try again.',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Bug report submitted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const submitAccountReport = async (req, res, next) => {
  try {
    const { reportedUserId, reason, details } = req.body;
    const reportedUser = await getUserById(reportedUserId);

    if (!reportedUser) {
      return res.status(404).json({
        success: false,
        message: 'Reported account not found',
      });
    }

    if (reportedUser._id === req.userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot report your own account',
      });
    }

    const sent = await sendAccountReportEmail({
      companyEmail: process.env.COMPANY_EMAIL || process.env.EMAIL_USER,
      reporter: {
        id: req.user?._id || req.userId,
        name: req.user?.name || 'Unknown User',
        email: req.user?.email || 'unknown@example.com',
      },
      reportedAccount: {
        id: reportedUser._id,
        name: reportedUser.name,
        email: reportedUser.email,
      },
      reason,
      details,
    });

    if (!sent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to submit account report. Please try again.',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Account report submitted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const requestSellerContact = async (req, res, next) => {
  try {
    const { listingId } = req.body;
    const listing = await getListingById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    const seller = await getUserById(listing.sellerId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found',
      });
    }

    if (seller._id === req.userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot request contact for your own listing',
      });
    }

    const sent = await sendContactRequestEmail({
      sellerEmail: seller.email,
      sellerName: seller.name,
      buyer: {
        id: req.user?._id || req.userId,
        name: req.user?.name || 'Unknown User',
        email: req.user?.email || 'unknown@example.com',
      },
      listing: {
        title: listing.title,
        category: listing.category,
        price: listing.price,
      },
    });

    if (!sent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to notify the seller. Please try again.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'The seller has been notified of your interest.',
    });
  } catch (error) {
    next(error);
  }
};
