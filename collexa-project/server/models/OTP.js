import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  
  otp: {
    type: String,
    required: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // TTL: 10 minutes
  },
});

// Compound index for verification
otpSchema.index({ email: 1, otp: 1 });

export default mongoose.model('OTP', otpSchema);
