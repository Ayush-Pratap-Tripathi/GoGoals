# GoGoals 🎯

A full-stack web application for goal tracking and management with user authentication, profile customization, and real-time analytics.

## 🌟 Features

- **User Authentication**: Secure signup/login with JWT tokens and bcrypt password hashing
- **Goal Management**: Create, update, delete, and track personal goals
- **🎤 Speech-to-Goal AI**: Convert voice input to structured goals using OpenAI Whisper & GPT-4o-mini
- **Progress Analytics**: Visual dashboards with charts and statistics
- **Bucket List**: Organize and manage life goals in a bucket list format
- **User Profiles**: Customize profile with name and profile picture (with image cropping)
- **Secure Account Deletion**: Multi-step account deletion with password verification
- **Responsive Design**: Beautiful UI optimized for desktop and mobile
- **Real-time Updates**: Instant synchronization of data across the app
- **Serverless Ready**: MongoDB-based audio storage (no persistent file system needed)

## 🛠️ Tech Stack

### Frontend
- **React** 18+ with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API requests
- **React Hot Toast** for notifications
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Easy Crop** for image cropping
- **Web Audio API** for microphone access

### Backend
- **Node.js** with Express 5
- **MongoDB** with Mongoose ODM
- **OpenAI API** (Whisper for transcription + GPT-4o-mini for extraction)
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for in-memory file handling
- **CORS** for cross-origin requests
- **Dotenv** for environment variables

### Storage & Deployment
- **MongoDB** for all data (including audio files as binary)
- **Serverless-ready** (no persistent file system needed)
- Compatible with Vercel, Render, AWS Lambda, etc.

## 📁 Project Structure

```
GoGoals/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── goalController.js     # Goal operations
│   │   └── speechController.js   # Speech-to-Goal AI pipeline
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT protection
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Goal.js               # Goal schema
│   │   └── Audio.js              # Audio storage in MongoDB
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── goalRoutes.js         # Goal endpoints
│   │   └── speechRoutes.js       # Speech processing endpoint
│   ├── server.js                 # Express app
│   ├── seedDummyData.js          # Sample data
│   ├── SPEECH_SETUP.md           # Speech feature setup guide
│   ├── package.json
│   └── .env                      # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/             # Login/Signup modals
│   │   │   ├── dashboard/        # Dashboard components
│   │   │   │   ├── SpeechRecordingButton.jsx
│   │   │   │   └── ...
│   │   │   ├── landing/          # Landing page
│   │   │   └── routing/          # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── MyGoalsPage.jsx
│   │   │   ├── BucketListPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── utils/
│   │   │   ├── chartHelpers.js
│   │   │   └── cropImage.js
│   │   ├── data/
│   │   │   └── quotes.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json               # Vercel routing config
│   ├── vite.config.js
│   ├── package.json
│   ├── .env                      # Environment variables
│   └── index.html
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/GoGoals.git
cd GoGoals
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

## 🔧 Environment Configuration

### Backend (.env)
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gogoals
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gogoals

JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development

# OpenAI API Key (for Speech-to-Goal feature)
OPENAI_API_KEY=sk-proj-your_openai_api_key_here
```

### Frontend (.env)
Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production:
```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

**Note**: Get your OpenAI API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

## 🎮 Running the Project

### Development Mode

**Start Backend** (from `backend/` directory):
```bash
npm run dev
```
Server runs on `http://localhost:5000`

**Start Frontend** (from `frontend/` directory):
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### Production Mode

**Build Frontend**:
```bash
cd frontend
npm run build
```

**Run Backend**:
```bash
cd backend
npm start
```

Or use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name "gogoals-api"
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile/name` - Update user name
- `PUT /api/auth/profile/avatar` - Update profile picture
- `DELETE /api/auth/profile` - Delete account (requires password)

### Goals
- `GET /api/goals` - Get all goals for current user
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Speech-to-Goal AI 🎤
- `POST /api/speech/transcribe-and-extract` - Convert audio to goal
  - **Request**: FormData with `audio` (file) and optional `language` (default: 'en')
  - **Response**: 
    ```json
    {
      "success": true,
      "audioId": "mongodb_id",
      "transcript": "Full transcribed text",
      "goalData": {
        "title": "Goal title",
        "category": "daily|weekly|monthly|yearly|bucket",
        "description": "Optional description",
        "scheduledDate": "YYYY-MM-DD or category-specific format"
      },
      "model": "whisper-1 + gpt-4o-mini"
    }
    ```
  - **Authentication**: Required (Bearer token)
  - **Audio Formats**: WAV, MP3, M4A, WebM, FLAC, Ogg (max 25MB)

## 🔐 Security Features

- JWT-based authentication with 30-day expiration
- Bcrypt password hashing with salt rounds
- Protected routes with middleware validation
- Password verification for account deletion
- CORS enabled for cross-origin requests
- Authorization headers required for protected endpoints

## 📱 Features Breakdown

### Authentication
- Secure signup with email validation
- Login with JWT token storage
- Session persistence using localStorage
- Automatic logout on token expiration

### Speech-to-Goal AI 🎤
- **Press-and-hold mic button** to record voice
- **Automatic transcription** using OpenAI Whisper API
- **Intelligent goal extraction** using GPT-4o-mini
- **Auto-fills goal form** with:
  - Title (cleaned of meta-actions)
  - Category detection (daily/weekly/monthly/yearly/bucket)
  - Scheduled date (category-specific format)
  - Optional description
- **Offline support**: Records locally, processes on server
- **Multiple formats**: Supports WebM, MP3, WAV, M4A, FLAC, Ogg
- **MongoDB storage**: All audio stored securely in MongoDB

### Goal Management
- Create goals via text input or voice
- Update goal progress and status
- Delete goals with confirmation
- Filter and sort goals
- Real-time goal statistics
- Automatic date format validation and correction

### User Profile
- Edit full name
- Upload and crop profile picture (2MB limit)
- View account settings
- Multi-step account deletion process
- Secure password verification for deletion

### Dashboard
- Visual goal statistics
- Charts and analytics
- Quick goal overview
- Motivational quotes
- Goal completion tracking
- Speech recording button on dashboard

## 🚢 Deployment

### Serverless Architecture ✅
This project is **serverless-ready** because:
- Audio is stored in MongoDB (not file system)
- No persistent storage needed
- In-memory file processing for Whisper API
- Works on Vercel, Render, AWS Lambda, Azure Functions, etc.

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set `VITE_API_BASE_URL` environment variable
4. Deploy automatically on push

### Backend (Vercel, Render, Railway, or other serverless platforms)
1. Create account on your chosen platform
2. Connect MongoDB Atlas database (required)
3. Set environment variables:
   - `MONGODB_URI` - MongoDB Atlas connection string
   - `JWT_SECRET` - Secret key for JWT
   - `OPENAI_API_KEY` - OpenAI API key for speech processing
4. Deploy from GitHub
5. Update frontend `VITE_API_BASE_URL` to point to deployed backend

### Recommended Serverless Platforms
- **Frontend**: Vercel (optimized for Next.js/React)
- **Backend**: Vercel, Render, Railway, or Heroku (Node.js compatible)
- **Database**: MongoDB Atlas (cloud MongoDB)

### Key Configuration Files
- `frontend/vercel.json` - Vercel routing configuration (SPA fallback)
- `backend/server.js` - CORS configured for all origins (production-safe)

## 🐛 Troubleshooting

### CORS Errors
If you see CORS errors, ensure:
- Backend CORS is properly configured
- Frontend API URL matches backend address
- Authorization headers are included

### 404 on Page Refresh
The `vercel.json` in frontend handles this. All routes redirect to `index.html`.

### MongoDB Connection Issues
- Verify connection string in `.env`
- Check MongoDB service is running
- Ensure IP whitelist includes your address (if using Atlas)

### Image Upload Issues
- Maximum file size is 2MB
- Only image formats (JPG, PNG) are accepted
- Check browser's local storage has space

### Speech-to-Goal Issues

**Microphone not working**
- Check browser permissions (allow microphone access)
- Try a different browser
- Ensure HTTPS on production (required for Web Audio API)
- Check system microphone is not in use by other apps

**"Audio file could not be decoded" error**
- Ensure browser supports WebM audio format
- Try a different browser (Chrome/Firefox/Edge recommended)
- Check your internet connection (OpenAI API must be reachable)

**Missing OpenAI API key**
- Generate key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Add `OPENAI_API_KEY` to backend `.env`
- Ensure key has sufficient quota/credits

**Goal data not being extracted**
- Check OpenAI API quota
- Verify `OPENAI_API_KEY` is valid
- Check backend logs for error details
- Ensure clear speech (Whisper works best with clear audio)

## 📈 Performance Tips

1. **Frontend**
   - Images are cropped automatically (reduces file size)
   - Lazy loading for components
   - Optimized bundle with Vite

2. **Backend**
   - Database indexes created for common queries
   - JWT caching prevents repeated validation
   - Request body limited to 10MB

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Ayush Pratap**

## 🙏 Acknowledgments

- [React](https://react.dev) - UI library
- [Express](https://expressjs.com) - Backend framework
- [MongoDB](https://www.mongodb.com) - Database
- [OpenAI](https://openai.com) - AI APIs (Whisper, GPT-4o-mini)
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Vite](https://vitejs.dev) - Build tool
- [Framer Motion](https://www.framer.com/motion) - Animations
- [Multer](https://github.com/expressjs/multer) - File upload handling
- [Mongoose](https://mongoosejs.com) - MongoDB ODM

---

**Last Updated**: April 23, 2026  
**Version**: 2.0.0 (with Speech-to-Goal AI)

## 📚 Additional Resources

- **Speech Setup Guide**: See [SPEECH_SETUP.md](backend/SPEECH_SETUP.md) for detailed speech-to-goal configuration
- **Speech Pipeline**: See [SPEECH_TO_GOAL_PIPELINE.md](backend/SPEECH_TO_GOAL_PIPELINE.md) for technical details
- **OpenAI Docs**: [api.openai.com/docs](https://platform.openai.com/docs)
- **MongoDB Docs**: [docs.mongodb.com](https://docs.mongodb.com)
- **React Docs**: [react.dev](https://react.dev)
