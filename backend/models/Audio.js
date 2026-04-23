import mongoose from 'mongoose';

const audioSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    audioData: {
      type: Buffer,
      required: true,
      description: 'Binary audio file data',
    },
    mimeType: {
      type: String,
      required: true,
      enum: ['audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/webm', 'audio/ogg', 'audio/flac'],
      description: 'Audio file MIME type',
    },
    originalFileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
      description: 'File size in bytes',
    },
    language: {
      type: String,
      default: 'en',
      description: 'Language code for transcription',
    },
    transcript: {
      type: String,
      default: null,
      description: 'Transcribed text from Whisper API',
    },
    extractedGoalData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      description: 'Extracted goal data from GPT processing',
    },
    processingStatus: {
      type: String,
      enum: ['uploaded', 'processing', 'completed', 'failed'],
      default: 'uploaded',
    },
    processingError: {
      type: String,
      default: null,
    },
    relatedGoal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
      default: null,
      description: 'Reference to the goal created from this audio',
    },
  },
  {
    timestamps: true,
  }
);

// Add index for user queries
audioSchema.index({ user: 1, createdAt: -1 });

// Set TTL for auto-deletion after 30 days (optional, can be disabled)
audioSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const Audio = mongoose.model('Audio', audioSchema);

export default Audio;
