import {
  createReportRecord,
  getListingById,
  getUserById,
  incrementListingReportCount,
  listReports,
} from '../services/dataService.js';

export const createReport = async (req, res, next) => {
  try {
    const { listingId, reason, description } = req.body;

    const listing = await getListingById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    const report = await createReportRecord({
      listingId,
      reportedBy: req.userId,
      reason,
      description,
    });

    await incrementListingReportCount(listingId);

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Admin will review it.',
      report,
    });
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

export const getMyReports = async (req, res, next) => {
  try {
    const reports = await listReports();
    const myReports = await Promise.all(
      reports
        .filter((report) => report.reportedBy === req.userId)
        .map(async (report) => {
          const listing = await getListingById(report.listingId);
          const reportedBy = await getUserById(report.reportedBy);
          return {
            ...report,
            listing: listing
              ? {
                  _id: listing._id,
                  id: listing._id,
                  title: listing.title,
                  status: listing.status,
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
      count: myReports.length,
      reports: myReports,
    });
  } catch (error) {
    next(error);
  }
};
