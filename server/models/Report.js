import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
    index: true,
  },
  
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    enum: [
      'Fake Listing',
      'Inappropriate Content',
      'Spam',
      'Incorrect Price',
      'Already Sold',
      'Other',
    ],
  },
  
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: '',
  },
  
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'dismissed', 'action_taken'],
    default: 'pending',
    index: true,
  },
  
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  
  reviewNote: {
    type: String,
    maxlength: 300,
    default: '',
  },
  
  reviewedAt: {
    type: Date,
    default: null,
  },
}, { 
  timestamps: true,
});

// Compound indexes
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ listing: 1, reportedBy: 1 }, { unique: true });

export default mongoose.model('Report', reportSchema);
