import jwt from 'jsonwebtoken';
import { getUserById, isEmailBlocked } from '../services/dataService.js';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please login.',
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.',
      });
    }

    if (await isEmailBlocked(user.email)) {
      return res.status(403).json({
        success: false,
        message: 'This account has been blocked from using Collexa.',
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email first',
      });
    }

    req.userId = user._id;
    req.user = user;
    req.isAdmin = user.isAdmin;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
    }

    res.status(401).json({
      success: false,
      message: 'Invalid token. Please login again.',
    });
  }
};

export default auth;
