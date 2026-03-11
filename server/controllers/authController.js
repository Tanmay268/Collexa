import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generateOTP from '../utils/generateOTP.js';
import { sendOTPEmail, sendPasswordResetOTPEmail } from '../utils/sendEmail.js';
import {
  blockEmailAddress,
  createUser,
  deleteOTP,
  getOTP,
  getUserByEmail,
  getUserById,
  isEmailBlocked,
  saveOTP,
  updateUser,
} from '../services/dataService.js';

const buildAuthUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || null,
  year: user.year || null,
  department: user.department || null,
  isVerified: user.isVerified,
  isAdmin: user.isAdmin,
  createdAt: user.createdAt,
});

const signToken = (user) =>
  jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

export const signup = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (await isEmailBlocked(email)) {
      return res.status(403).json({
        success: false,
        message: 'This email has been blocked from using Collexa.',
      });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered. Please login.',
      });
    }

    const otp = generateOTP();
    await saveOTP(email, otp);

    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Valid for 10 minutes.',
      email,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp, name, password, phone } = req.body;

    if (await isEmailBlocked(email)) {
      return res.status(403).json({
        success: false,
        message: 'This email has been blocked from using Collexa.',
      });
    }

    const otpRecord = await getOTP(email, otp);
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered. Please login.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await createUser({
      name,
      email,
      passwordHash,
      phone: phone || null,
      year: null,
      department: null,
      profilePicture: null,
      isVerified: true,
      isAdmin: false,
      lastLoginAt: null,
    });

    await deleteOTP(email);

    res.status(201).json({
      success: true,
      message: 'Account verified successfully',
      token: signToken(user),
      user: buildAuthUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (await isEmailBlocked(email)) {
      return res.status(403).json({
        success: false,
        message: 'This email has been blocked from using Collexa.',
      });
    }

    const user = await getUserByEmail(email);
    const isMatch = user ? await bcrypt.compare(password, user.passwordHash || '') : false;

    if (!user || !isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email first',
      });
    }

    const updatedUser = await updateUser(user._id, { lastLoginAt: new Date() });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: signToken(updatedUser),
      user: buildAuthUser(updatedUser),
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.userId);

    res.status(200).json({
      success: true,
      user: buildAuthUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (await isEmailBlocked(email)) {
      return res.status(403).json({
        success: false,
        message: 'This email has been blocked from using Collexa.',
      });
    }

    const otp = generateOTP();
    await saveOTP(email, otp);
    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email',
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (await isEmailBlocked(email)) {
      return res.status(403).json({
        success: false,
        message: 'This email has been blocked from using Collexa.',
      });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email',
      });
    }

    const otp = generateOTP();
    await saveOTP(email, otp);

    const emailSent = await sendPasswordResetOTPEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send reset OTP. Please try again.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email. Valid for 10 minutes.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (await isEmailBlocked(email)) {
      return res.status(403).json({
        success: false,
        message: 'This email has been blocked from using Collexa.',
      });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email',
      });
    }

    const otpRecord = await getOTP(email, otp);
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await updateUser(user._id, { passwordHash });
    await deleteOTP(email);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};
