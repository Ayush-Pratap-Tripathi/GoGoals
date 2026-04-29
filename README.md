# GoGoals 🎯

A full-stack goal tracking and achievement platform with AI-powered voice input, premium subscriptions via Razorpay, real-time analytics, and a beautiful responsive UI.

### 🔗 [Live Demo → go-goals.vercel.app](https://go-goals.vercel.app/)

## 🌟 Features

- **User Authentication** — Secure signup/login with JWT tokens and bcrypt password hashing
- **Goal Management** — Create, update, delete, and track daily, weekly, monthly, and yearly goals
- **🎤 Speech-to-Goal AI** — Convert voice input to structured goals using OpenAI Whisper & GPT-4o-mini
- **📊 Progress Analytics** — Interactive charts (weekly, monthly, yearly, decade) with time-travel navigation
- **🪣 Bucket List** — Organize and manage life goals in a dedicated bucket list
- **👤 User Profiles** — Customize name and profile picture with image cropping
- **💎 Premium Plans** — Upgrade via Razorpay payment gateway with 4 plan tiers
- **🔐 Secure Account Deletion** — Multi-step deletion with password verification
- **📱 Responsive Design** — Mobile-first UI with horizontal swipe navigation and desktop chart views
- **💬 Motivational Quotes** — Cycling motivational quotes with smooth fade transitions
- **☁️ Serverless Ready** — MongoDB-based storage (including audio), no persistent file system needed

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite 8
- **Tailwind CSS 4** for styling
- **React Router 7** for navigation
- **Axios** for API requests
- **React Hot Toast** for notifications
- **Framer Motion** for animations
- **Recharts** for analytics charts
- **Lucide React** for icons
- **React Easy Crop** for image cropping
- **Razorpay Checkout SDK** for payment UI
- **Web Audio API** for microphone access

### Backend
- **Node.js** with Express 5
- **MongoDB** with Mongoose ODM
- **Razorpay Node SDK** for order creation and payment verification
- **OpenAI API** (Whisper for transcription + GPT-4o-mini for extraction)
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for in-memory file handling
- **CORS** for cross-origin requests
- **Dotenv** for environment variables

### Storage & Deployment
- **MongoDB Atlas** for all data (users, goals, audio files as binary)
- **Vercel** for frontend hosting
- **Serverless-ready** (no persistent file system needed)

## 📁 Project Structure

```
GoGoals/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Auth logic (register, login, profile)
│   │   ├── goalController.js      # Goal CRUD operations
│   │   ├── paymentController.js   # Razorpay order creation & verification
│   │   └── speechController.js    # Speech-to-Goal AI pipeline
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protection
│   ├── models/
│   │   ├── User.js                # User schema (with premium fields)
│   │   ├── Goal.js                # Goal schema
│   │   └── Audio.js               # Audio storage in MongoDB
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   ├── goalRoutes.js          # Goal endpoints
│   │   ├── paymentRoutes.js       # Payment endpoints
│   │   └── speechRoutes.js        # Speech processing endpoint
│   ├── server.js                  # Express app entry point
│   ├── seedDummyData.js           # Sample data seeder
│   ├── package.json
│   └── .env                       # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/              # Login/Signup modals
│   │   │   ├── dashboard/         # Dashboard components
│   │   │   │   ├── DashboardNavbar.jsx
│   │   │   │   ├── DashboardFooter.jsx
│   │   │   │   ├── StatCard.jsx
│   │   │   │   ├── ChartBlock.jsx
│   │   │   │   ├── GoalModal.jsx
│   │   │   │   ├── GoalCreateModal.jsx
│   │   │   │   ├── GoalListSection.jsx
│   │   │   │   ├── BucketListModal.jsx
│   │   │   │   ├── PremiumUpgradeModal.jsx
│   │   │   │   └── SpeechRecordingButton.jsx
│   │   │   ├── landing/           # Landing page components
│   │   │   └── routing/           # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state
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
│   │   │   └── quotes.js         # Motivational quotes
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vercel.json                # Vercel routing config
│   ├── vite.config.js
│   ├── package.json
│   ├── .env                       # Frontend env variables
│   └── index.html
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Razorpay account (for payment integration)
- OpenAI API key (for Speech-to-Goal feature)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Ayush-Pratap-Tripathi/GoGoals.git
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
MONGO_URI=mongodb://localhost:27017/gogoals
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gogoals

JWT_SECRET=your_super_secret_jwt_key_here

# OpenAI API Key (for Speech-to-Goal feature)
OPENAI_API_KEY=sk-proj-your_openai_api_key_here

# Razorpay API Keys (for premium payments)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
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

> **Note**: Get your OpenAI API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys) and Razorpay keys from [dashboard.razorpay.com](https://dashboard.razorpay.com/app/keys)

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

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/auth/me` | Get current user |
| `PUT` | `/api/auth/profile/name` | Update user name |
| `PUT` | `/api/auth/profile/avatar` | Update profile picture |
| `DELETE` | `/api/auth/profile` | Delete account (requires password) |

### Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/goals` | Get all goals for current user |
| `POST` | `/api/goals` | Create new goal |
| `PUT` | `/api/goals/:id` | Update goal |
| `DELETE` | `/api/goals/:id` | Delete goal |

### Payment (Razorpay) 💎
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payment/create-order` | Create Razorpay order for a plan |
| `POST` | `/api/payment/verify` | Verify payment signature & activate premium |

### Speech-to-Goal AI 🎤
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/speech/transcribe-and-extract` | Convert audio to structured goal |

**Speech Response Example:**
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

> All protected endpoints require `Authorization: Bearer <token>` header.

## 💎 Premium Plans

GoGoals offers a freemium model where premium users unlock advanced features:

| Plan | Price | Savings |
|------|-------|---------|
| 1 Month | ₹500 | — |
| 3 Months | ₹1,400 | Save 6.7% |
| 6 Months | ₹2,500 | Save 16.7% |
| 1 Year | ₹4,800 | Save 20% |

### Premium Features
- 🎤 **Voice-to-Goal AI** — Create goals using voice commands
- 📊 **Advanced Analytics** — Monthly, yearly, and overall analytics charts
- 🎯 **Unlimited Goals** — No restrictions on goal creation
- 🛡️ **Priority Support** — Faster issue resolution

### Payment Flow
1. User selects a plan in the Premium modal
2. Backend creates a Razorpay order via the Orders API
3. Razorpay Checkout popup opens with prefilled user details
4. User completes payment (card, UPI, netbanking, wallet)
5. Backend verifies HMAC SHA256 signature
6. User's `isPremium` flag is set to `true` with calculated `premiumExpiryDate`
7. Auth context updates immediately — premium features unlock instantly

## 🔐 Security Features

- JWT-based authentication with 30-day expiration
- Bcrypt password hashing with salt rounds
- Protected routes with middleware validation
- Password verification for account deletion
- CORS enabled for cross-origin requests
- Razorpay HMAC SHA256 signature verification for payment integrity
- Server-side order creation (no client-side amount tampering)

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
- **Auto-fills goal form** with title, category, scheduled date, and description
- **Multiple formats**: Supports WebM, MP3, WAV, M4A, FLAC, Ogg
- **MongoDB storage**: All audio stored securely in MongoDB (serverless-compatible)
- **Premium-only**: Non-premium users see a shake animation + upgrade prompt

### Goal Management
- Create goals via text input or voice
- Categories: daily, weekly, monthly, yearly, bucket
- Toggle completion status
- Delete goals with confirmation
- Real-time goal statistics and scoring (0–10 scale)
- Automatic date format validation per category

### Dashboard
- Stat cards for daily, weekly, monthly, and yearly progress
- Interactive charts with time-travel navigation (previous/next period)
- Trackpad swipe support for chart navigation
- Mobile: horizontal swipe between stats and charts screens
- Desktop: vertical scroll with floating navigation controls
- Cycling motivational quotes with smooth fade transitions
- Premium-locked content shown as blurred with lock overlay + shake animation

### User Profile
- Edit full name
- Upload and crop profile picture (2MB limit)
- View account settings
- Multi-step account deletion with password verification

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

### Backend (Vercel, Render, Railway, or other platforms)
1. Create account on your chosen platform
2. Connect MongoDB Atlas database
3. Set environment variables:
   - `MONGO_URI` — MongoDB Atlas connection string
   - `JWT_SECRET` — Secret key for JWT
   - `OPENAI_API_KEY` — OpenAI API key for speech processing
   - `RAZORPAY_KEY_ID` — Razorpay API Key ID
   - `RAZORPAY_KEY_SECRET` — Razorpay API Key Secret
4. Deploy from GitHub
5. Update frontend `VITE_API_BASE_URL` to point to deployed backend

### Key Configuration Files
- `frontend/vercel.json` — Vercel routing configuration (SPA fallback)
- `backend/server.js` — CORS configured for all origins

## 🐛 Troubleshooting

### CORS Errors
- Ensure backend CORS is properly configured
- Frontend API URL must match backend address
- Authorization headers must be included

### 404 on Page Refresh
The `vercel.json` in frontend handles this — all routes redirect to `index.html`.

### MongoDB Connection Issues
- Verify connection string in `.env`
- Check MongoDB service is running
- Ensure IP whitelist includes your address (if using Atlas)

### Image Upload Issues
- Maximum file size is 2MB
- Only image formats (JPG, PNG) are accepted

### Speech-to-Goal Issues
- **Microphone not working**: Check browser permissions, try a different browser, ensure HTTPS in production
- **Audio decode error**: Ensure browser supports WebM, try Chrome/Firefox/Edge
- **Missing API key**: Add `OPENAI_API_KEY` to backend `.env`
- **Goal not extracted**: Check OpenAI API quota and key validity

### Payment Issues
- **Razorpay popup not opening**: Ensure the checkout script is loaded in `index.html`
- **Order creation failing**: Check `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in backend `.env`
- **Signature verification failing**: Ensure the key secret matches between order creation and verification
- **Premium not activating**: Check backend logs for verification errors

## 📈 Performance Tips

1. **Frontend**
   - Images are cropped client-side (reduces upload size)
   - Lazy loading for components
   - Optimized bundle with Vite
   - Chart data computed from in-memory goal array (no extra API calls)

2. **Backend**
   - Database indexes for common queries
   - JWT verification prevents repeated DB lookups
   - Razorpay instance lazy-initialized (avoids module-load issues)
   - Request body limited to 10MB

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Ayush Pratap Tripathi**

## 🙏 Acknowledgments

- [React](https://react.dev) — UI library
- [Express](https://expressjs.com) — Backend framework
- [MongoDB](https://www.mongodb.com) — Database
- [Razorpay](https://razorpay.com) — Payment gateway
- [OpenAI](https://openai.com) — AI APIs (Whisper, GPT-4o-mini)
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Vite](https://vitejs.dev) — Build tool
- [Framer Motion](https://www.framer.com/motion) — Animations
- [Recharts](https://recharts.org) — Charting library
- [Mongoose](https://mongoosejs.com) — MongoDB ODM

---

**Last Updated**: April 30, 2026
**Version**: 3.0.0 (with Razorpay Premium Payments)

## 📚 Additional Resources

- **Live Demo**: [go-goals.vercel.app](https://go-goals.vercel.app/)
- **Speech Setup Guide**: See [SPEECH_SETUP.md](backend/SPEECH_SETUP.md) for detailed speech-to-goal configuration
- **Speech Pipeline**: See [SPEECH_TO_GOAL_PIPELINE.md](backend/SPEECH_TO_GOAL_PIPELINE.md) for technical details
- **Razorpay Docs**: [razorpay.com/docs](https://razorpay.com/docs/)
- **OpenAI Docs**: [platform.openai.com/docs](https://platform.openai.com/docs)
- **MongoDB Docs**: [docs.mongodb.com](https://docs.mongodb.com)
- **React Docs**: [react.dev](https://react.dev)
