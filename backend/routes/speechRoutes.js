import express from 'express';
import multer from 'multer';
import { transcribeAndExtractGoal } from '../controllers/speechController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for in-memory audio file uploads (serverless-compatible)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'audio/wav',
      'audio/x-wav',
      'audio/mpeg',
      'audio/mp4',
      'audio/x-m4a',
      'audio/webm',
      'audio/ogg',
      'audio/flac',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: MP3, WAV, M4A, WebM, FLAC, Ogg`));
    }
  },
});

/**
 * POST /api/speech/transcribe-and-extract
 * Complete Pipeline: Audio → Whisper Transcription → GPT-4o mini Extraction → Structured Goal Data
 * 
 * Request:
 *   - multipart/form-data
 *   - audio: audio file (MP3, WAV, M4A, WebM, FLAC, or Ogg)
 *   - language: (optional) language code (default: 'en')
 * 
 * Response:
 *   {
 *     "success": true,
 *     "transcript": "Full transcribed text here",
 *     "goalData": {
 *       "title": "Learn Guitar",
 *       "category": "Skills",
 *       "description": "Master basic guitar chords and songs",
 *       "scheduledDate": "2026-06-30"
 *     },
 *     "model": "whisper-1 + gpt-4o-mini"
 *   }
 */
router.post('/transcribe-and-extract', protect, upload.single('audio'), transcribeAndExtractGoal);

export default router;
