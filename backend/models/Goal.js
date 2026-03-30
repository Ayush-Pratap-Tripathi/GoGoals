import mongoose from 'mongoose';

const goalSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title value'],
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['daily', 'weekly', 'monthly', 'yearly', 'bucket'],
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;
