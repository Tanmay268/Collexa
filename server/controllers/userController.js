import bcrypt from 'bcryptjs';
import { getUserById, updateUser } from '../services/dataService.js';

const buildProfileUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || null,
  year: user.year || null,
  department: user.department || null,
  profilePicture: user.profilePicture || null,
  isVerified: user.isVerified,
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
    const { name, phone, year, department } = req.body;
    const user = await updateUser(req.userId, {
      name,
      phone,
      year,
      department,
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
