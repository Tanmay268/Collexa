import {
  getListingById,
  getReportById,
  getUserById,
  listReports,
  listUsers,
  paginate,
  syncExpiredListings,
  updateListingRecord,
  updateReportRecord,
} from '../services/dataService.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = (await listUsers()).map(({ passwordHash, ...user }) => user);
    const page = paginate(users, req.query.page, req.query.limit || 50);

    res.status(200).json({
      success: true,
      count: page.total,
      totalPages: page.totalPages,
      users: page.items,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllListingsAdmin = async (req, res, next) => {
  try {
    const allListings = await syncExpiredListings();
    const filteredListings = allListings.filter((listing) =>
      req.query.status && req.query.status !== 'all' ? listing.status === req.query.status : true
    );
    const page = paginate(filteredListings, req.query.page, req.query.limit || 50);
    const listings = await Promise.all(
      page.items.map(async (listing) => {
        const seller = await getUserById(listing.sellerId);
        return {
          ...listing,
          seller: seller
            ? {
                _id: seller._id,
                id: seller._id,
                name: seller.name,
                email: seller.email,
              }
            : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: page.total,
      listings,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReports = async (req, res, next) => {
  try {
    const reports = await listReports();
    const filteredReports = reports.filter((report) =>
      req.query.status && req.query.status !== 'all' ? report.status === req.query.status : true
    );
    const page = paginate(filteredReports, req.query.page, req.query.limit || 50);
    const hydratedReports = await Promise.all(
      page.items.map(async (report) => {
        const [listing, reportedBy] = await Promise.all([
          getListingById(report.listingId),
          getUserById(report.reportedBy),
        ]);
        const listingSeller = listing ? await getUserById(listing.sellerId) : null;

        return {
          ...report,
          listing: listing
            ? {
                _id: listing._id,
                id: listing._id,
                title: listing.title,
                seller: listingSeller
                  ? {
                      _id: listingSeller._id,
                      id: listingSeller._id,
                      name: listingSeller.name,
                      email: listingSeller.email,
                    }
                  : null,
              }
            : null,
          reportedBy: reportedBy
            ? {
                _id: reportedBy._id,
                id: reportedBy._id,
                name: reportedBy.name,
                email: reportedBy.email,
              }
            : null,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: page.total,
      reports: hydratedReports,
    });
  } catch (error) {
    next(error);
  }
};

export const reviewReport = async (req, res, next) => {
  try {
    const { action, reviewNote, deleteListingIfActionTaken } = req.body;
    const report = await getReportById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    const reviewedReport = await updateReportRecord(report._id, {
      status: action,
      reviewedBy: req.userId,
      reviewNote: reviewNote || '',
      reviewedAt: new Date(),
    });

    if (action === 'action_taken' && deleteListingIfActionTaken) {
      await updateListingRecord(report.listingId, { status: 'deleted' });
    }

    res.status(200).json({
      success: true,
      message: 'Report reviewed successfully',
      report: reviewedReport,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const [users, listings, reports] = await Promise.all([
      listUsers(),
      syncExpiredListings(),
      listReports(),
    ]);

    const stats = {
      totalUsers: users.length,
      verifiedUsers: users.filter((user) => user.isVerified).length,
      totalListings: listings.length,
      activeListings: listings.filter((listing) => listing.status === 'active').length,
      expiredListings: listings.filter((listing) => listing.status === 'expired').length,
      deletedListings: listings.filter((listing) => listing.status === 'deleted').length,
      pendingReports: reports.filter((report) => report.status === 'pending').length,
      totalReports: reports.length,
      listingsByCategory: listings
        .filter((listing) => listing.status === 'active')
        .reduce((acc, listing) => {
          acc[listing.category] = (acc[listing.category] || 0) + 1;
          return acc;
        }, {}),
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};
