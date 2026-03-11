import bcrypt from 'bcryptjs';
import { admin } from '../config/firebase.js';
import { getUserById, updateUser } from '../services/dataService.js';

const buildProfileUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || null,
  phoneVerified: !!user.phoneVerified,
  year: user.year || null,
  department: user.department || null,
  accountType: user.accountType || 'student',
  profilePicture: user.profilePicture || null,
  isVerified: user.isVerified,
  isAdmin: user.isAdmin,
});

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await getUserById(req.userId);

    res.status(200).json({
      success: true,
      user: buildProfileUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, year, department, accountType } = req.body;
    const currentUser = await getUserById(req.userId);
    const user = await updateUser(req.userId, {
      name: name?.trim(),
      year: year || null,
      department: department?.trim() || null,
      accountType: accountType || currentUser.accountType || 'student',
      profilePicture: req.file ? req.file.path : undefined,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: buildProfileUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const verifyProfilePhone = async (req, res, next) => {
  try {
    const { phone, firebaseIdToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    const normalizedPhone = `+91${phone.trim()}`;

    if (decodedToken.phone_number !== normalizedPhone) {
      return res.status(400).json({
        success: false,
        message: 'Phone verification failed. The verified Firebase phone number does not match.',
      });
    }

    const user = await updateUser(req.userId, {
      phone: phone.trim(),
      phoneVerified: true,
    });

    res.status(200).json({
      success: true,
      message: 'Phone number verified successfully.',
      user: buildProfileUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await getUserById(req.userId);

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash || '');
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await updateUser(req.userId, { passwordHash });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};
