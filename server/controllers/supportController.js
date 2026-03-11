import { sendBugReportEmail } from '../utils/sendEmail.js';

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

