import { body, param, query, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  
  next();
};

export const signupValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
    .matches(/@vitstudent\.ac\.in$/)
    .withMessage('Must be a valid VIT student email (@vitstudent.ac.in)'),
  
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be 8-128 characters'),
  
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid Indian phone number'),
];

export const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const otpValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers'),
];

export const listingValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be 5-100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be 10-1000 characters'),
  
  body('category')
    .isIn(['Books', 'Cycles', 'Electronics', 'Instruments', 'Sports Equipment', 'Lab Equipment', 'Others'])
    .withMessage('Invalid category'),
  
  body('condition')
    .isIn(['New', 'Like New', 'Good', 'Fair'])
    .withMessage('Invalid condition'),
  
  body('price')
    .isFloat({ min: 0, max: 100000 })
    .withMessage('Price must be between ₹0 and ₹1,00,000')
    .toFloat(),
  
  body('listingType')
    .isIn(['sell', 'rent'])
    .withMessage('Listing type must be either "sell" or "rent"'),
];

export const reportValidation = [
  body('listingId')
    .isMongoId()
    .withMessage('Invalid listing ID'),
  
  body('reason')
    .isIn(['Fake Listing', 'Inappropriate Content', 'Spam', 'Incorrect Price', 'Already Sold', 'Other'])
    .withMessage('Invalid reason'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

export const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

export default validate;
