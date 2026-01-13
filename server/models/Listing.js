import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },

  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Books',
      'Cycles',
      'Electronics',
      'Instruments',
      'Sports Equipment',
      'Lab Equipment',
      'Others',
    ],
  },

  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: ['New', 'Like New', 'Good', 'Fair'],
  },

  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    max: [100000, 'Price cannot exceed ₹1,00,000'],
  },

  listingType: {
    type: String,
    required: [true, 'Listing type is required'],
    enum: ['sell', 'rent'],
  },

  rentDuration: {
    type: String,
    enum: ['per day', 'per week', 'per month', null],
    default: null,
  },

  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true }
  }],

  status: {
    type: String,
    enum: ['active', 'expired', 'deleted'],
    default: 'active',
    index: true,
  },

  expiresAt: {
    type: Date,
    required: true,
    index: true,
    default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
  },

  viewCount: {
    type: Number,
    default: 0,
  },

  reportCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Compound indexes for common queries
listingSchema.index({ status: 1, category: 1 });
listingSchema.index({ status: 1, price: 1 });
listingSchema.index({ status: 1, createdAt: -1 });

// Virtual for days remaining
listingSchema.virtual('daysRemaining').get(function () {
  const now = new Date();
  const diff = this.expiresAt - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

export default mongoose.model('Listing', listingSchema);
