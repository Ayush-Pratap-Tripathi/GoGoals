# Speech Recognition Setup Guide

This guide walks through setting up the OpenAI Whisper API for the GoGoals backend.

## Prerequisites

1. **Node.js 14+** installed on your system
2. **OpenAI API Key** - Get one at: https://platform.openai.com/api-keys
3. **npm** (comes with Node.js)

## Installation Steps

### 1. Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install all dependencies including OpenAI and multer
npm install
```

### 2. Get OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (save it somewhere safe - you won't see it again)

### 3. Configure Environment Variables

Create or update your `.env` file in the backend directory:

```env
# Add your OpenAI API key
OPENAI_API_KEY=sk-proj-your_actual_api_key_here

# Keep your existing configuration
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4. Start the Server

```bash
# Make sure you're in the backend directory
npm run dev  # For development with auto-reload
# or
npm start    # For production
```

## 📝 Testing the Endpoint

### Using Postman

1. **Method**: POST
2. **URL**: `http://localhost:5000/api/speech/transcribe`
3. **Headers**: `Content-Type: multipart/form-data`
4. **Body** (form-data):
   - **Key**: `audio` (type: file)
   - **Value**: Select your audio file
   - **Key**: `language` (type: text) - Optional
   - **Value**: Language code like `en` (default), `fr`, `es`, etc.

### Using cURL

```bash
curl -X POST http://localhost:5000/api/speech/transcribe \
  -F "audio=@/path/to/audio.mp3" \
  -F "language=en"
```

### Expected Response (200 OK)

```json
{
  "success": true,
  "transcript": "I want to learn guitar by next summer",
  "language": "en",
  "model": "whisper-1"
}
```

### Error Response

```json
{
  "error": "Transcription failed",
  "details": "Invalid API key provided"
}
```

## 📋 Supported Audio Formats

- **MP3** (most common)
- **WAV**
- **M4A** (iPhone audio)
- **WebM**
- **FLAC**
- **Ogg**

**Note**: Max file size is 25MB. For best results, use clear audio with minimal background noise.

## 💰 Pricing

OpenAI Whisper API costs:
- **$0.02** per minute of audio (rounded to nearest second)
- Much cheaper than real-time transcription services
- Pay as you go - no monthly fees

Example: 5 minutes of audio = $0.10

## 🌍 Supported Languages

Whisper automatically detects language, but you can optionally specify:
- `en` - English (default)
- `fr` - French
- `es` - Spanish
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `nl` - Dutch
- `ru` - Russian
- `zh` - Chinese (Simplified)
- `ja` - Japanese
- `ko` - Korean

And 80+ more languages. See [OpenAI docs](https://platform.openai.com/docs/guides/speech-to-text) for complete list.

## 🛠️ Troubleshooting

### Error: OPENAI_API_KEY not configured

```
Error: OPENAI_API_KEY not configured in environment variables
```

**Solution**:
- Make sure your `.env` file has the `OPENAI_API_KEY` variable set
- Restart your server after updating `.env`
- Verify the key is correct and not expired

### Error: Invalid API Key

```
Error: 401 Unauthorized - Invalid API key
```

**Solution**:
- Check your API key at https://platform.openai.com/api-keys
- Make sure you're using the latest key
- Verify there are no extra spaces or characters

### Error: No audio file provided

```
Error: No audio file provided. Please upload an audio file.
```

**Solution**:
- Make sure you're sending the file in the `audio` field
- Use `multipart/form-data` content type
- Verify the file exists and is readable

### Error: Invalid audio format

```
Error: Invalid audio format. Supported formats: MP3, WAV, M4A, WebM, FLAC, Ogg
```

**Solution**:
- Convert your audio to a supported format
- Use tools like FFmpeg: `ffmpeg -i input.m4a output.mp3`
- Verify the file MIME type

### Error: Rate limit exceeded

```
Error: 429 Too Many Requests
```

**Solution**:
- OpenAI has rate limits based on your plan
- Implement request queuing in production
- Wait a few seconds and retry

## 📦 API Endpoint Summary

```
POST /api/speech/transcribe
├── Input: Audio file (multipart/form-data)
│   ├── audio (required): Audio file
│   └── language (optional): Language code (default: 'en')
├── Processing: OpenAI Whisper-1 transcription
├── Output: {
│     "success": true,
│     "transcript": "...",
│     "language": "en",
│     "model": "whisper-1"
│   }
└── Status: ✅ Ready to test
```

## ✅ Next Steps

1. **Test the endpoint** in Postman/Insomnia with sample audio
2. **Integrate with LLM** (GPT-4) to extract goal data from transcription
3. **Build UI component** with floating mic icon
4. **Connect UI to endpoint** for speech-to-goal feature

## 📚 Resources

- [OpenAI Whisper Docs](https://platform.openai.com/docs/guides/speech-to-text)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference/audio)
- [Node OpenAI SDK](https://github.com/openai/node-sdk)
