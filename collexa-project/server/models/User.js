import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@vitstudent\.ac\.in$/,
      'Must be a valid VIT student email',
    ],
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  
  phone: {
    type: String,
    default: null,
    match: [/^[6-9]\d{9}$/, 'Invalid phone number'],
  },
  
  isVerified: {
    type: Boolean,
    default: false,
  },
  
  isAdmin: {
    type: Boolean,
    default: false,
  },
  
  year: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG', null],
    default: null,
  },
  
  department: {
    type: String,
    maxlength: 50,
    default: null,
  },
  
  lastLoginAt: {
    type: Date,
    default: null,
  },
}, { 
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Index for faster queries
userSchema.index({ email: 1 });

export default mongoose.model('User', userSchema);
