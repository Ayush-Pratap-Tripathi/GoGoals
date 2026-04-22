# Speech-to-Goal Pipeline Setup Guide

## Overview

This is a complete AI-powered pipeline that converts speech to structured goal data:

```
🎤 Audio Input
    ↓
🔄 Whisper Transcription (OpenAI)
    ↓
📝 Transcript Text
    ↓
🤖 GPT-4o Mini Extraction
    ↓
📊 Structured Goal JSON
```

## Endpoint

**URL**: `POST http://localhost:5000/api/speech/transcribe-and-extract`

**Purpose**: Convert audio speech directly into goal data ready for database insertion.

## Setup

### Prerequisites

1. Node.js 14+ installed
2. OpenAI API Key with access to:
   - `whisper-1` model
   - `gpt-4o-mini` model

### Installation

```bash
cd backend
npm install
```

### Configuration

Add to your `.env` file:

```env
OPENAI_API_KEY=sk-proj-your_actual_api_key_here
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Start Server

```bash
npm run dev
```

## Testing the Endpoint

### Using Postman

1. **Method**: POST
2. **URL**: `http://localhost:5000/api/speech/transcribe-and-extract`
3. **Headers**: `Content-Type: multipart/form-data`
4. **Body** (form-data):
   - **Key**: `audio` (type: file)
   - **Value**: Select an audio file (MP3, WAV, M4A, WebM, FLAC, or Ogg)
   - **Key**: `language` (type: text) - Optional
   - **Value**: Language code like `en` (default), `fr`, `es`, etc.

### Using cURL

```bash
curl -X POST http://localhost:5000/api/speech/transcribe-and-extract \
  -F "audio=@/path/to/audio.mp3" \
  -F "language=en"
```

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "transcript": "I want to learn guitar by next summer",
  "goalData": {
    "title": "Learn Guitar",
    "category": "weekly",
    "description": null,
    "scheduledDate": "2026-W26"
  },
  "model": "whisper-1 + gpt-4o-mini"
}
```

## Goal Data Fields - Exact Database Format

The extracted `goalData` uses your project's exact structure:

| Field | Type | Required | Enum Values | Format | Example |
|-------|------|----------|-------------|--------|---------|
| `title` | string | ✅ Yes | - | Max 100 chars | "Learn Guitar" |
| `category` | string | ✅ Yes | daily, weekly, monthly, yearly, bucket | One of enum | "weekly" |
| `description` | string | ❌ No | - | Text | "Master chords" |
| `scheduledDate` | string | ❌ No | - | Format depends on category | See below |

### Category & Date Format Combinations

#### 1. **Daily** (`category: "daily"`)
- **Format**: `YYYY-MM-DD`
- **Example**: `"2026-04-25"`
- **Use case**: Specific day goal
- **Auto-detection**: "tomorrow", "next Monday", "April 25th"

#### 2. **Weekly** (`category: "weekly"`)
- **Format**: `YYYY-W##` (ISO week format)
- **Example**: `"2026-W17"` (week 17 of 2026)
- **Use case**: Goal for a specific week
- **Auto-detection**: "next week", "this summer" (becomes W26), "in 2 weeks"

#### 3. **Monthly** (`category: "monthly"`)
- **Format**: `YYYY-MM`
- **Example**: `"2026-06"` (June 2026)
- **Use case**: Goal for a specific month
- **Auto-detection**: "next month", "June", "in 3 months"

#### 4. **Yearly** (`category: "yearly"`)
- **Format**: `YYYY` (just the year)
- **Example**: `"2027"`
- **Use case**: Goal for a specific year
- **Auto-detection**: "next year", "2027", "by 2026"

#### 5. **Bucket** (`category: "bucket"`)
- **Format**: `null` (no date required)
- **Example**: `null`
- **Use case**: Bucket list item (no deadline)
- **Auto-detection**: "someday", "bucket list", no time mention

## How the Pipeline Works

### Step 1: Whisper Transcription
- Audio file is sent to OpenAI's Whisper API
- Converts speech to text with high accuracy
- Supports 99+ languages
- Returns raw transcription

### Step 2: GPT-4o Mini Extraction & Formatting
- Uses GPT-4o mini to intelligently extract goal information
- Analyzes the transcript and determines goal type (daily/weekly/monthly/yearly/bucket)
- Formats dates in the exact format your project requires:
  - **Daily**: `YYYY-MM-DD` format
  - **Weekly**: `YYYY-W##` format (ISO week)
  - **Monthly**: `YYYY-MM` format
  - **Yearly**: `YYYY` format
  - **Bucket**: `null`
- Returns validated, database-ready goal data

## Supported Audio Formats

- **MP3** (most common)
- **WAV** (16-bit, mono recommended)
- **M4A** (iPhone audio)
- **WebM**
- **FLAC**
- **Ogg**

**Max file size**: 25MB

**Recommended**: Clear audio, minimal background noise, 16kHz sample rate

## Example Usage with Goal Creation

Once you have the `goalData` from this endpoint, you can use it directly to create a goal:

```bash
# Step 1: Get structured goal data from speech
curl -X POST http://localhost:5000/api/speech/transcribe-and-extract \
  -F "audio=@recording.mp3"

# Response includes goalData with exact database format

# Step 2: Create goal in database using the extracted data
curl -X POST http://localhost:5000/api/goals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "title": "Learn Guitar",
    "category": "weekly",
    "description": null,
    "scheduledDate": "2026-W26"
  }'
```

### Example 1: Weekly Goal
**Audio**: "I want to learn guitar by next summer"
```json
{
  "title": "Learn Guitar",
  "category": "weekly",
  "description": null,
  "scheduledDate": "2026-W26"
}
```

### Example 2: Daily Goal
**Audio**: "Run 5 kilometers tomorrow morning"
```json
{
  "title": "Run 5 Kilometers",
  "category": "daily",
  "description": "Morning running session",
  "scheduledDate": "2026-04-21"
}
```

### Example 3: Monthly Goal
**Audio**: "Complete my project by next month"
```json
{
  "title": "Complete Project",
  "category": "monthly",
  "description": null,
  "scheduledDate": "2026-05"
}
```

### Example 4: Yearly Goal
**Audio**: "I want to save 10 thousand dollars in 2027"
```json
{
  "title": "Save 10000 Dollars",
  "category": "yearly",
  "description": "Financial savings goal",
  "scheduledDate": "2027"
}
```

### Example 5: Bucket List Goal
**Audio**: "Visit the Eiffel Tower someday"
```json
{
  "title": "Visit the Eiffel Tower",
  "category": "bucket",
  "description": null,
  "scheduledDate": null
}
```

## Pricing

### OpenAI Costs (as of April 2026)

**Whisper API**:
- $0.02 per minute of audio (rounded to nearest second)

**GPT-4o Mini API**:
- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens

**Example for 1 minute of audio**:
- Whisper: $0.02
- GPT extraction (avg): ~$0.001
- **Total per goal: ~$0.021** (~2 cents)

## Troubleshooting

### Error: OPENAI_API_KEY not configured
- Make sure `.env` file has `OPENAI_API_KEY` set
- Restart the server after updating `.env`

### Error: Invalid API Key (401)
- Check API key at https://platform.openai.com/api-keys
- Verify no extra spaces in the key
- Ensure account has active credits

### Error: No audio file provided
- Ensure file is in `audio` form field (not `file`)
- Verify file is readable and not corrupted

### Error: Invalid audio format
- Use supported formats: MP3, WAV, M4A, WebM, FLAC, Ogg
- Convert using FFmpeg if needed: `ffmpeg -i input.m4a output.mp3`

### Error: Connection timeout
- Check internet connection
- Verify OpenAI API is accessible
- Try with a smaller audio file

### GPT extraction returning null for optional fields
- This is normal - means the information wasn't mentioned in speech
- UI can handle null values for optional fields

## Supported Categories

Your project uses these goal category enums:

1. **daily** - Goal for a specific day (format: `YYYY-MM-DD`)
2. **weekly** - Goal for a specific week (format: `YYYY-W##`)
3. **monthly** - Goal for a specific month (format: `YYYY-MM`)
4. **yearly** - Goal for a specific year (format: `YYYY`)
5. **bucket** - Bucket list item without deadline (format: `null`)

## Date Conversion Examples

The system intelligently converts relative dates and formats them for your project:

### Date Format by Category

| Speech Input | Context | Category | Format | Output |
|------|--------|----------|--------|--------|
| "tomorrow" | April 20, 2026 | daily | YYYY-MM-DD | `"2026-04-21"` |
| "next week" | April 20, 2026 | weekly | YYYY-W## | `"2026-W17"` |
| "next month" | April 20, 2026 | monthly | YYYY-MM | `"2026-05"` |
| "next year" | April 20, 2026 | yearly | YYYY | `"2027"` |
| "next summer" | April 20, 2026 | weekly | YYYY-W## | `"2026-W26"` |
| "June" | April 20, 2026 | monthly | YYYY-MM | `"2026-06"` |
| "2027" | April 20, 2026 | yearly | YYYY | `"2027"` |
| "April 25th" | April 20, 2026 | daily | YYYY-MM-DD | `"2026-04-25"` |
| "no date" | - | bucket | null | `null` |
| "bucket list" | - | bucket | null | `null` |

## API Endpoint Summary

```
POST /api/speech/transcribe-and-extract
├── Input: Audio file + optional language code
├── Step 1: Whisper Transcription → Raw text
├── Step 2: GPT-4o Mini Extraction → Formatted goal data
├── Output: {
│   "success": true,
│   "transcript": "...",
│   "goalData": {
│     "title": "...",
│     "category": "daily|weekly|monthly|yearly|bucket",
│     "description": "..." or null,
│     "scheduledDate": "YYYY-MM-DD" | "YYYY-W##" | "YYYY-MM" | "YYYY" | null
│   },
│   "model": "whisper-1 + gpt-4o-mini"
│ }
└── Ready for: Direct database insertion via POST /api/goals
```

## Current Date Context

- **Today**: April 20, 2026
- **Week 16**: April 13-19
- **Week 17**: April 20-26
- **Week 26** (Summer): June 22-28
