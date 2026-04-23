import OpenAI from 'openai';
import Audio from '../models/Audio.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Complete pipeline: Audio → Whisper → GPT-4o mini extraction → Structured Goal Data
 * Audio is stored in MongoDB instead of file system for serverless compatibility
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const transcribeAndExtractGoal = async (req, res) => {
  let audioRecord = null;
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        error: 'No audio file provided. Please upload an audio file.',
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'OPENAI_API_KEY not configured in environment variables',
      });
    }

    const audioBuffer = req.file.buffer;
    const language = req.body.language || 'en';

    // Validate file format
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
    if (!allowedMimes.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: `Invalid audio format. Supported formats: MP3, WAV, M4A, WebM, FLAC, Ogg. Received: ${req.file.mimetype}`,
      });
    }

    // Step 0: Save audio to MongoDB for serverless compatibility
    console.log('💾 Step 0: Saving audio to MongoDB...');
    audioRecord = new Audio({
      user: req.user.id,
      audioData: audioBuffer,
      mimeType: req.file.mimetype,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      language: language,
      processingStatus: 'processing',
    });
    await audioRecord.save();
    console.log(`✅ Audio saved to MongoDB with ID: ${audioRecord._id}`);

    console.log('🎤 Step 1: Transcribing audio with Whisper...');
    // Step 1: Transcribe audio with Whisper
    const transcript = await transcribeWithWhisper(audioBuffer, apiKey, language, req.file.originalname, req.file.mimetype);
    if (transcript.error) {
      audioRecord.processingStatus = 'failed';
      audioRecord.processingError = transcript.details;
      await audioRecord.save();
      return res.status(500).json(transcript);
    }

    console.log('✅ Transcript:', transcript.text);
    console.log('🤖 Step 2: Extracting goal data with GPT-4o mini...');
    // Step 2: Extract structured goal data using GPT-4o mini
    const goalData = await extractGoalDataWithGPT(transcript.text, apiKey);

    if (goalData.error) {
      audioRecord.processingStatus = 'failed';
      audioRecord.processingError = goalData.details || goalData.error;
      await audioRecord.save();
      return res.status(500).json(goalData);
    }

    // Update audio record with processing results
    audioRecord.transcript = transcript.text;
    audioRecord.extractedGoalData = goalData;
    audioRecord.processingStatus = 'completed';
    await audioRecord.save();

    console.log('✅ Extracted Goal Data:', goalData);
    return res.status(200).json({
      success: true,
      audioId: audioRecord._id,
      transcript: transcript.text,
      goalData: goalData,
      model: 'whisper-1 + gpt-4o-mini',
    });
  } catch (error) {
    // Mark processing as failed in MongoDB if record exists
    if (audioRecord) {
      audioRecord.processingStatus = 'failed';
      audioRecord.processingError = error.message;
      await audioRecord.save().catch(err => console.error('Error updating audio record:', err));
    }

    console.error('Pipeline error:', error);
    res.status(500).json({
      error: 'Speech to goal conversion failed',
      message: error.message,
    });
  }
};

/**
 * Transcribe audio using OpenAI's Whisper API
 * @param {Buffer} audioBuffer - Audio file buffer from multer (in-memory)
 * @param {string} apiKey - OpenAI API key
 * @param {string} language - Language code
 * @param {string} originalname - Original filename with extension
 * @param {string} mimeType - MIME type of the audio
 * @returns {Promise<Object>} Transcription result
 */
const transcribeWithWhisper = async (audioBuffer, apiKey, language, originalname, mimeType) => {
  // Extract extension from original filename or determine from MIME type
  let extension = path.extname(originalname) || getMimeExtension(mimeType);
  const tempFile = path.join(os.tmpdir(), `audio-${Date.now()}${extension}`);
  
  try {
    // Write buffer to temporary file for OpenAI SDK (serverless-safe)
    fs.writeFileSync(tempFile, audioBuffer);
    console.log(`📝 Temp audio file created: ${tempFile}`);

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const audioStream = fs.createReadStream(tempFile);

    const response = await openai.audio.transcriptions.create({
      file: audioStream,
      model: 'whisper-1',
      language: language,
      response_format: 'json',
    });

    return {
      success: true,
      text: response.text,
    };
  } catch (error) {
    console.error('Whisper API error:', error);
    return {
      error: 'Transcription failed',
      details: error.message,
    };
  } finally {
    // Clean up temporary file
    try {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
        console.log(`🗑️ Temp file cleaned up: ${tempFile}`);
      }
    } catch (cleanupError) {
      console.warn('Error cleaning up temp file:', cleanupError);
    }
  }
};

/**
 * Get file extension from MIME type
 * @param {string} mimeType - MIME type (e.g., 'audio/webm')
 * @returns {string} File extension with dot (e.g., '.webm')
 */
const getMimeExtension = (mimeType) => {
  const mimeToExtension = {
    'audio/wav': '.wav',
    'audio/x-wav': '.wav',
    'audio/mpeg': '.mp3',
    'audio/mp4': '.m4a',
    'audio/x-m4a': '.m4a',
    'audio/webm': '.webm',
    'audio/ogg': '.ogg',
    'audio/flac': '.flac',
  };
  return mimeToExtension[mimeType] || '.webm';
};

/**
 * Extract structured goal data from transcript using GPT-4o mini
 * @param {string} transcript - Transcribed text from Whisper
 * @param {string} apiKey - OpenAI API key
 * @returns {Promise<Object>} Structured goal data
 */
const extractGoalDataWithGPT = async (transcript, apiKey) => {
  try {
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const systemPrompt = `You are an AI assistant that extracts goal information from user speech and formats it for a goal tracking application.

CRITICAL INSTRUCTION FOR TITLE EXTRACTION:
Extract the CORE GOAL ITSELF, not the meta-action or process of creating/scheduling it.
- User says: "Schedule completing my project for October" → Extract: "Complete my project" (NOT "Schedule completing my project")
- User says: "I want to learn guitar" → Extract: "Learn guitar" (NOT "I want to learn guitar")
- User says: "Plan a trip to Paris" → Extract: "Trip to Paris" (NOT "Plan a trip to Paris")
- User says: "Make sure I exercise daily" → Extract: "Exercise daily" (NOT "Make sure I exercise daily")

Extract the following information and return ONLY a JSON object (no additional text):

1. title (string, required): The core goal title/name - what the user WANTS TO ACHIEVE, not the meta-action (max 100 chars)
   - Remove verbs like: schedule, plan, create, make, ensure, remember, set, add, mark
   - Remove phrases like: "I want to", "I need to", "I should", "I plan to", "I want to make sure"
   - Keep action verbs that describe the goal itself: learn, run, complete, visit, save, build, etc.
   
2. category (string, required): Must be EXACTLY one of: 'daily', 'weekly', 'monthly', 'yearly', 'bucket'
   - daily: Goal to be completed on a specific day
   - weekly: Goal for a specific week
   - monthly: Goal for a specific month
   - yearly: Goal for a specific year
   - bucket: Bucket list item (no specific date)
   
3. description (string, optional): Detailed description of the goal (add context/why if mentioned)
4. scheduledDate (string, optional): Must match the exact format for the chosen category:
   - For daily: "YYYY-MM-DD" format (e.g., "2026-04-20")
   - For weekly: "YYYY-W##" format (e.g., "2026-W15" for week 15)
   - For monthly: "YYYY-MM" format (e.g., "2026-04")
   - For yearly: "YYYY" format (e.g., "2026")
   - For bucket: null (no date)

DATE CONVERSION RULES:
- "next summer" → "2026-W26" (weekly) or "2026-06" (monthly)
- "in 3 months" → calculate from today (April 20, 2026) → "2026-07" (monthly)
- "next year" → "2027"
- "this week" → "2026-W16"
- "today" → "2026-04-20"
- "next Monday" → calculate the date → "2026-04-21"
- For dates, today is April 20, 2026

CATEGORY SELECTION LOGIC:
1. Infer the goal type (daily/weekly/monthly/yearly) from context
2. If a specific date is mentioned → daily category
3. If a week/timeframe is mentioned → weekly category
4. If a month/season is mentioned → monthly category
5. If a year is mentioned → yearly category
6. If no timeframe → bucket category
7. Format the date according to category

IMPORTANT RULES:
- Always return ONLY valid JSON, nothing else
- If a field is optional and not mentioned, use null
- title and category are REQUIRED - never null
- scheduledDate should match the exact format for the category
- Validate that category is one of the enum values
- If category is 'bucket', scheduledDate must be null
- THINK CAREFULLY: Extract what the user wants to ACHIEVE, not what process they're describing

Current date context: April 20, 2026

Return ONLY the JSON object.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Extract and structure this goal from speech: "${transcript}"`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content.trim();
    console.log('🤖 GPT Response:', content);

    let goalData;
    try {
      goalData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse GPT response:', content);
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        goalData = JSON.parse(jsonMatch[0]);
      } else {
        return {
          error: 'Failed to parse extracted goal data',
          details: 'Invalid JSON response from GPT',
        };
      }
    }

    // Validate required fields
    if (!goalData.title || !goalData.category) {
      return {
        error: 'Missing required fields in extracted data',
        details: 'title and category are required',
        partialData: goalData,
      };
    }

    // Validate category enum
    const validCategories = ['daily', 'weekly', 'monthly', 'yearly', 'bucket'];
    if (!validCategories.includes(goalData.category)) {
      return {
        error: 'Invalid category value',
        details: `category must be one of: ${validCategories.join(', ')}. Got: ${goalData.category}`,
        partialData: goalData,
      };
    }

    // Validate scheduledDate format based on category
    if (goalData.scheduledDate) {
      const dateValidation = validateDateFormat(goalData.scheduledDate, goalData.category);
      if (!dateValidation.valid) {
        console.warn(`Date format warning: ${dateValidation.message}`);
        // If format is invalid, try to correct it
        goalData.scheduledDate = correctDateFormat(goalData.scheduledDate, goalData.category);
      }
    }

    // For bucket category, scheduledDate must be null
    if (goalData.category === 'bucket') {
      goalData.scheduledDate = null;
    }

    // Clean up the data
    return {
      title: cleanAndRefineTitle(goalData.title),
      category: goalData.category,
      description: goalData.description ? String(goalData.description).trim() : null,
      scheduledDate: goalData.scheduledDate || null,
    };
  } catch (error) {
    console.error('GPT extraction error:', error);
    return {
      error: 'Failed to extract goal data from transcript',
      details: error.message,
    };
  }
};

/**
 * Clean and refine goal title - removes meta-actions and filler phrases
 * @param {string} title - Raw title from GPT
 * @returns {string} Cleaned title
 */
const cleanAndRefineTitle = (title) => {
  if (!title) return title;

  let cleaned = String(title).trim();

  // List of meta-action phrases to remove from the beginning
  const metaActionPrefixes = [
    /^schedule\s+/i,
    /^plan\s+/i,
    /^plan\s+to\s+/i,
    /^create\s+/i,
    /^make\s+/i,
    /^make\s+sure\s+/i,
    /^ensure\s+/i,
    /^remember\s+/i,
    /^remember\s+to\s+/i,
    /^set\s+/i,
    /^set\s+a\s+/i,
    /^add\s+/i,
    /^mark\s+/i,
    /^mark\s+as\s+/i,
    /^i\s+want\s+to\s+/i,
    /^i\s+need\s+to\s+/i,
    /^i\s+should\s+/i,
    /^i\s+would\s+like\s+to\s+/i,
    /^i\s+plan\s+to\s+/i,
    /^i\s+want\s+to\s+make\s+sure\s+/i,
    /^try\s+to\s+/i,
    /^attempt\s+to\s+/i,
    /^start\s+/i,
    /^begin\s+/i,
    /^get\s+/i,
    /^get\s+to\s+/i,
  ];

  // Remove meta-action prefixes
  for (const pattern of metaActionPrefixes) {
    if (pattern.test(cleaned)) {
      cleaned = cleaned.replace(pattern, '');
      break; // Only remove one prefix to avoid over-cleaning
    }
  }

  // Capitalize first letter
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Ensure title is not too long
  if (cleaned.length > 100) {
    cleaned = cleaned.substring(0, 100).trim();
  }

  return cleaned;
};

/**
 * Validate date format based on category
 * @param {string} date - The date string to validate
 * @param {string} category - The goal category
 * @returns {Object} Validation result
 */
const validateDateFormat = (date, category) => {
  if (!date) return { valid: true };

  switch (category) {
    case 'daily':
      // YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return { valid: true };
      }
      return { valid: false, message: `Daily date must be YYYY-MM-DD format, got: ${date}` };

    case 'weekly':
      // YYYY-W## format (ISO week)
      if (/^\d{4}-W\d{2}$/.test(date)) {
        return { valid: true };
      }
      return { valid: false, message: `Weekly date must be YYYY-W## format, got: ${date}` };

    case 'monthly':
      // YYYY-MM format
      if (/^\d{4}-\d{2}$/.test(date)) {
        return { valid: true };
      }
      return { valid: false, message: `Monthly date must be YYYY-MM format, got: ${date}` };

    case 'yearly':
      // YYYY format (just year)
      if (/^\d{4}$/.test(date)) {
        return { valid: true };
      }
      return { valid: false, message: `Yearly date must be YYYY format, got: ${date}` };

    default:
      return { valid: true };
  }
};

/**
 * Correct date format based on category
 * @param {string} date - The date string to correct
 * @param {string} category - The goal category
 * @returns {string} Corrected date or null
 */
const correctDateFormat = (date, category) => {
  try {
    switch (category) {
      case 'daily':
        // Try to parse and format as YYYY-MM-DD
        const dailyDate = new Date(date);
        if (!isNaN(dailyDate)) {
          return dailyDate.toISOString().split('T')[0];
        }
        return null;

      case 'weekly':
        // Try to parse and format as YYYY-W##
        const weekDate = new Date(date);
        if (!isNaN(weekDate)) {
          return dateToWeekFormat(weekDate);
        }
        return null;

      case 'monthly':
        // Try to parse and format as YYYY-MM
        const monthDate = new Date(date);
        if (!isNaN(monthDate)) {
          return monthDate.toISOString().slice(0, 7);
        }
        return null;

      case 'yearly':
        // Extract year
        const year = date.match(/\d{4}/);
        return year ? year[0] : null;

      default:
        return null;
    }
  } catch (error) {
    console.error('Date correction error:', error);
    return null;
  }
};

/**
 * Convert date to ISO week format (YYYY-W##)
 * @param {Date} date - The date to convert
 * @returns {string} ISO week format string
 */
const dateToWeekFormat = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
};
