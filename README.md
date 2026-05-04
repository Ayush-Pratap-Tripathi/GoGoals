# GoGoals 🎯

> A full-stack goal tracking and achievement platform with **AI-powered voice input**, **live Razorpay payment integration**, **real-time analytics**, and a **beautiful responsive UI**.

**Status**: ✅ Production-Ready | Latest Commit: "Integrated live and actual payment with razorpay"

### 🔗 [Live Demo → go-goals.vercel.app](https://go-goals.vercel.app/)

---

## 🌟 Core Features

### 🔐 Authentication & User Management
- **Secure Signup/Login** — JWT tokens with 30-day expiry, bcrypt password hashing
- **User Profiles** — Customize name and profile picture with image cropping
- **Account Management** — Multi-step password verification for secure deletion

### 🎯 Goal Management System
- **Flexible Goal Creation** — Daily, weekly, monthly, yearly, and bucket list goals
- **Goal Tracking** — Mark complete/incomplete, edit, and delete goals
- **Goal Organization** — Category-based filtering and time-based scheduling

### 🎤 AI-Powered Speech-to-Goal (Premium Feature)
- **Voice Input Processing** — Record directly from browser microphone
- **Automatic Transcription** — OpenAI Whisper API transcribes audio to text
- **Intelligent Extraction** — GPT-4o-mini extracts structured goal data from transcripts
- **Multi-Language Support** — Process audio in multiple languages
- **Audio Storage** — Secure MongoDB storage of all audio files for serverless deployment

### 📊 Advanced Analytics & Charts
- **Multiple Time Views** — Weekly, monthly, yearly, and overall completion analytics
- **Interactive Charts** — Built with Recharts for smooth, responsive visualizations
- **Time-Travel Navigation** — Navigate through different time periods to see historical data
- **Completion Statistics** — Real-time tracking of goal completion rates

### 🪣 Bucket List Management
- **Dedicated Bucket List** — Organize long-term life goals separately
- **Flexible Timeline** — Track aspirational goals without time constraints
- **Category Support** — Organize bucket list items by custom categories

### 💎 Premium Plans with Live Razorpay Integration
- **4-Tier Pricing** — 1 Month (₹500), 3 Months (₹1,400), 6 Months (₹2,500), 1 Year (₹4,800)
- **Live Payment Processing** — Real Razorpay payment gateway (not sandbox)
- **Flexible Upgrades** — Extend expiry date by purchasing additional plans
- **Feature Gating** — Speech-to-Goal AI locked behind premium status
- **Premium Status Tracking** — Expiry date management in user database

### 📱 Responsive & Mobile-First Design
- **Horizontal Swipe Navigation** — Mobile-friendly goal browsing
- **Responsive Charts** — Charts adapt for desktop and mobile views
- **Touch Optimized** — Microphone button and touch controls optimized for mobile
- **Modern UI** — Smooth animations with Framer Motion

### 💬 Additional Features
- **Motivational Quotes** — Rotating quotes with fade transitions for inspiration
- **Real-Time Notifications** — Toast notifications for all user actions
- **Secure Logout** — Automatic logout with localStorage cleanup
- **Rate Limiting Ready** — Backend structured for easy rate limiting implementation

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.4 | UI library and component framework |
| Vite | 8.0.1 | Lightning-fast build tool and dev server |
| Tailwind CSS | 4.2.2 | Utility-first CSS framework |
| React Router | 7.13.2 | Client-side routing |
| Axios | 1.14.0 | HTTP client for API requests |
| Framer Motion | 12.38.0 | Animation library |
| Recharts | 3.8.1 | React component library for charts |
| Razorpay Checkout | - | Payment gateway UI (CDN) |
| React Easy Crop | 5.5.7 | Image cropping tool |
| Lucide React | 1.7.0 | Icon library |
| React Hot Toast | 2.6.0 | Toast notifications |
| Sonner | 2.0.7 | Alternative toast library |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | - | JavaScript runtime |
| Express | 5.2.1 | Web framework |
| MongoDB | - | NoSQL database (Atlas) |
| Mongoose | 9.3.3 | MongoDB ODM |
| OpenAI | 4.104.0 | Whisper & GPT-4o-mini APIs |
| Razorpay | 2.9.6 | Payment gateway SDK |
| JSON Web Token (JWT) | 9.0.3 | Authentication tokens |
| Bcrypt | 6.0.0 | Password hashing |
| Multer | 1.4.5-lts.2 | In-memory file upload handling |
| CORS | 2.8.6 | Cross-origin requests |
| Dotenv | 17.3.1 | Environment variable management |

### Infrastructure
| Service | Purpose |
|---------|---------|
| MongoDB Atlas | Primary database (cloud-hosted) |
| Vercel | Frontend deployment (serverless) |
| OpenAI API | Whisper + GPT-4o-mini models |
| Razorpay Live | Live payment processing (INR) |

---

## 📁 Complete Project Structure

```
GoGoals/
├── README.md                          # This file
├── backend/
│   ├── config/
│   │   └── db.js                      # MongoDB connection configuration
│   │
│   ├── controllers/
│   │   ├── authController.js          # Auth endpoints (register, login, profile, logout)
│   │   ├── goalController.js          # Goal CRUD operations
│   │   ├── paymentController.js       # Razorpay order creation & verification
│   │   └── speechController.js        # Speech-to-Goal AI pipeline
│   │
│   ├── middleware/
│   │   └── authMiddleware.js          # JWT token verification
│   │
│   ├── models/
│   │   ├── User.js                    # User schema (name, email, password, isPremium, premiumExpiryDate)
│   │   ├── Goal.js                    # Goal schema (title, description, category, date, completion)
│   │   └── Audio.js                   # Audio storage schema (MongoDB binary storage)
│   │
│   ├── routes/
│   │   ├── authRoutes.js              # POST /auth/register, /auth/login, /auth/me, /auth/update-profile
│   │   ├── goalRoutes.js              # GET/POST/PUT/DELETE goals endpoints
│   │   ├── paymentRoutes.js           # POST /payment/create-order, /payment/verify
│   │   └── speechRoutes.js            # POST /speech/transcribe (multipart form-data)
│   │
│   ├── server.js                      # Express app entry point
│   ├── seedDummyData.js               # Sample data for testing
│   ├── package.json                   # Backend dependencies
│   ├── SPEECH_SETUP.md                # Speech-to-Goal setup guide
│   ├── SPEECH_TO_GOAL_PIPELINE.md     # Detailed AI pipeline documentation
│   └── .env                           # Environment variables (not in repo)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginModal.jsx     # Login form modal
│   │   │   │   └── SignupModal.jsx    # Registration form modal
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardNavbar.jsx        # Top navigation bar
│   │   │   │   ├── DashboardFooter.jsx       # Footer with motivational quote
│   │   │   │   ├── StatCard.jsx              # Statistics cards (goals count, etc)
│   │   │   │   ├── ChartBlock.jsx            # Analytics chart container
│   │   │   │   ├── GoalModal.jsx             # Goal detail/edit modal
│   │   │   │   ├── GoalCreateModal.jsx       # New goal creation modal
│   │   │   │   ├── GoalListSection.jsx       # Goal list display with filters
│   │   │   │   ├── BucketListModal.jsx       # Bucket list management
│   │   │   │   ├── PremiumUpgradeModal.jsx   # Razorpay pricing & upgrade
│   │   │   │   └── SpeechRecordingButton.jsx # Microphone UI & recording logic
│   │   │   │
│   │   │   ├── landing/
│   │   │   │   ├── Navbar.jsx         # Landing page navigation
│   │   │   │   ├── HeroSection.jsx    # Hero banner
│   │   │   │   ├── FeaturesSection.jsx # Feature showcase
│   │   │   │   ├── CTASection.jsx     # Call-to-action
│   │   │   │   └── Footer.jsx         # Landing footer
│   │   │   │
│   │   │   └── routing/
│   │   │       └── ProtectedRoute.jsx # Route guard for authenticated pages
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Global auth state & user management
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx        # Public landing page
│   │   │   ├── DashboardPage.jsx      # Main dashboard (protected)
│   │   │   ├── MyGoalsPage.jsx        # Goals detail view (protected)
│   │   │   ├── BucketListPage.jsx     # Bucket list page (protected)
│   │   │   └── ProfilePage.jsx        # User profile & settings (protected)
│   │   │
│   │   ├── data/
│   │   │   └── quotes.js              # Motivational quotes array
│   │   │
│   │   ├── utils/
│   │   │   ├── chartHelpers.js        # Chart data processing functions
│   │   │   └── cropImage.js           # Image cropping utility
│   │   │
│   │   ├── App.jsx                    # Main app component with routing
│   │   ├── App.css                    # App-level styles
│   │   ├── index.css                  # Global styles
│   │   └── main.jsx                   # React entry point
│   │
│   ├── public/                        # Static assets
│   ├── dist/                          # Build output
│   ├── index.html                     # HTML entry point (includes Razorpay script)
│   ├── vite.config.js                 # Vite configuration
│   ├── eslint.config.js               # Linting rules
│   ├── package.json                   # Frontend dependencies
│   ├── vercel.json                    # Vercel deployment config
│   └── README.md                      # Frontend-specific documentation
│
└── .gitignore                         # Git ignore rules
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v18+ and npm
- **MongoDB Atlas** account (free tier available)
- **OpenAI API** key with access to Whisper and GPT-4o-mini models
- **Razorpay Account** (live mode)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/GoGoals.git
cd GoGoals
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:
```env
# Server
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=GoGoals

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# OpenAI API (for Whisper & GPT-4o-mini)
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_KEY

# Razorpay Live (Real Payment Processing)
RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
```

#### MongoDB Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add your IP to network access
4. Create a database user
5. Copy connection string to `MONGO_URI`

#### OpenAI Setup
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Ensure your account has access to:
   - `whisper-1` model (audio transcription)
   - `gpt-4o-mini` model (goal extraction)

#### Razorpay Setup
1. Sign up at [Razorpay](https://razorpay.com)
2. Verify your account
3. Go to Settings → API Keys
4. Copy **Live** mode keys (not sandbox)
5. Enable payments on live account

### Step 3: Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production (Vercel):
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

---

## 🏃 Running the Project

### Local Development

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### Production Build

```bash
# Frontend
cd frontend
npm run build
npm run preview

# Backend (deployment-ready)
cd backend
npm start
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login with email & password
GET    /api/auth/me                Get current user profile (Protected)
PUT    /api/auth/update-profile    Update name/profile picture (Protected)
POST   /api/auth/logout            Logout current user (Protected)
```

### Goals
```
GET    /api/goals                  Get all user goals (Protected)
POST   /api/goals                  Create new goal (Protected)
PUT    /api/goals/:id              Update goal (Protected)
DELETE /api/goals/:id              Delete goal (Protected)
PATCH  /api/goals/:id/complete     Toggle goal completion (Protected)
```

### Speech-to-Goal (Premium)
```
POST   /api/speech/transcribe      Convert audio to goal (Protected, Premium Only)
```

### Payments
```
POST   /api/payment/create-order   Create Razorpay order (Protected)
POST   /api/payment/verify         Verify payment & activate premium (Protected)
```

---

## 💰 Premium Plans & Razorpay Integration

### Plan Configuration
The backend defines 4 premium tiers (in `paymentController.js`):

| Plan | Duration | Price (INR) | Amount (Paise) |
|------|----------|------------|----------------|
| 1 Month | 1 month | ₹500 | 50,000 |
| 3 Months | 3 months | ₹1,400 | 140,000 |
| 6 Months | 6 months | ₹2,500 | 250,000 |
| 1 Year | 12 months | ₹4,800 | 480,000 |

### Payment Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. User clicks "Upgrade to Premium"                     │
│    → Sees PremiumUpgradeModal with 4 plan options      │
└──────────────┬──────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Frontend: POST /api/payment/create-order             │
│    ├─ payload: { planId: "month1" }                    │
│    └─ returns: { order_id, key_id, amount, currency }  │
└──────────────┬──────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Razorpay Checkout Modal Opens                        │
│    ├─ User enters card/UPI details                      │
│    ├─ Payment processed with Razorpay                   │
│    └─ Returns: razorpay_payment_id, order_id, signature │
└──────────────┬──────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Frontend: POST /api/payment/verify                   │
│    ├─ payload: { razorpay_payment_id, order_id,        │
│    │            razorpay_signature, planId }           │
│    └─ Backend verifies HMAC-SHA256 signature            │
└──────────────┬──────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Backend: Update User Model                           │
│    ├─ Set isPremium = true                              │
│    ├─ Calculate premiumExpiryDate                       │
│    ├─ Extend if already premium                         │
│    └─ Return updated user + new JWT                     │
└──────────────┬──────────────────────────────────────────┘
               ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Frontend: Update Auth Context                        │
│    ├─ Login with new user data & token                 │
│    ├─ Show success toast                                │
│    └─ SpeechRecordingButton now unlocked               │
└─────────────────────────────────────────────────────────┘
```

### Security Features
- **Signature Verification**: HMAC-SHA256 signature verification using Razorpay secret
- **Plan Validation**: Backend validates requested plan against config
- **User Verification**: Only request's authenticated user can activate their own premium
- **Token Refresh**: New JWT token issued after successful payment
- **Expiry Calculation**: Extends from current expiry if already premium

---

## 🎤 Speech-to-Goal AI Feature

### How It Works

```
Audio Input (WAV/MP3/WebM)
          ↓
┌─────────────────────────────────────┐
│ Step 1: Audio Uploaded to MongoDB   │
│ ├─ In-memory buffer via Multer      │
│ ├─ Stored as binary in MongoDB      │
│ └─ Serverless-compatible            │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Step 2: Whisper Transcription       │
│ ├─ Audio → Text                     │
│ ├─ Multi-language support           │
│ └─ OpenAI Whisper-1 model           │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Step 3: GPT-4o-mini Extraction      │
│ ├─ Text → Structured Goal Data      │
│ ├─ Extracts: title, description,    │
│ │   category, date                  │
│ └─ LLM-powered parsing              │
└──────────────┬──────────────────────┘
               ↓
Structured Goal Object
```

### Supported Audio Formats
- MP3 (`.mp3`)
- WAV (`.wav`)
- WebM (`.webm`)
- FLAC (`.flac`)
- Ogg (`.ogg`)
- M4A (`.m4a`)

### Language Support
- English (default)
- Any language supported by Whisper (auto-detection available)

### API Response
```json
{
  "success": true,
  "audioId": "507f1f77bcf86cd799439011",
  "transcript": "Create a daily goal to exercise for 30 minutes in the morning",
  "goalData": {
    "title": "Exercise for 30 minutes",
    "description": "Daily morning exercise routine",
    "category": "daily",
    "scheduledDate": null
  },
  "model": "whisper-1 + gpt-4o-mini"
}
```

---

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  profilePicture: String (default: ''),
  password: String (hashed with bcrypt),
  isPremium: Boolean (default: false),
  premiumExpiryDate: Date (null if not premium),
  createdAt: Date,
  updatedAt: Date
}
```

### Goal Schema
```javascript
{
  user: ObjectId (references User),
  title: String (required),
  description: String,
  category: String (enum: 'daily', 'weekly', 'monthly', 'yearly', 'bucket'),
  scheduledDate: String (HTML5 format: YYYY-MM, YYYY-W##),
  isCompleted: Boolean,
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Audio Schema
```javascript
{
  user: ObjectId (references User),
  audioData: Buffer (binary audio file),
  mimeType: String (audio/mp3, audio/wav, etc),
  originalFileName: String,
  fileSize: Number,
  language: String,
  transcript: String (Whisper output),
  extractedGoalData: Object (GPT-4o-mini output),
  processingStatus: String (enum: 'processing', 'completed', 'failed'),
  processingError: String (error details if failed),
  createdAt: Date
}
```

---

## 🔒 Authentication & Authorization

### JWT Implementation
- **Token Expiry**: 30 days
- **Storage**: localStorage (frontend)
- **Format**: `Bearer {token}` in Authorization header
- **Verification**: authMiddleware on protected routes

### Protected Routes
All routes except `/api/auth/register` and `/api/auth/login` require JWT token:

```javascript
// Protected route example
router.post('/create-order', protect, createOrder);
                            ↑
                    authMiddleware
```

### Premium Feature Gating
The Speech-to-Goal feature checks `isPremium` status:

```javascript
// Frontend: SpeechRecordingButton.jsx
if (!user?.isPremium) {
  toast.error('Upgrade to premium to use this feature');
  return;
}
```

---

## 🧪 Testing the Project

### Test Workflow

#### 1. User Registration & Login
```bash
# Test signup
POST http://localhost:5000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

# Test login
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
# Returns: { user, token }
```

#### 2. Create a Goal
```bash
POST http://localhost:5000/api/goals
Headers: Authorization: Bearer {token}
{
  "title": "Complete React project",
  "description": "Finish building the dashboard",
  "category": "daily",
  "scheduledDate": null
}
```

#### 3. Upgrade to Premium (with Razorpay Test Keys)
- Click "Upgrade to Premium" button
- Select any plan
- Use Razorpay test card details (if in test mode)
- For live mode, use real card

#### 4. Access Speech-to-Goal (Premium Only)
```bash
POST http://localhost:5000/api/speech/transcribe
Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data
- file: (audio file)
- language: en
```

---

## 📊 Key Features Deep Dive

### Goal Categories
- **Daily**: Goals to complete every day
- **Weekly**: Goals for specific weeks
- **Monthly**: Goals for specific months
- **Yearly**: Long-term goals for years
- **Bucket**: Aspirational life goals (no time constraint)

### Analytics Views
- **Weekly**: Last 7 days of goal completion
- **Monthly**: Last 30 days of goal completion
- **Yearly**: Last 365 days of goal completion
- **Overall**: All-time completion statistics

### Time-Travel Navigation
Users can navigate through different weeks/months to see historical completion data without affecting current view.

---

## 🚀 Deployment

### Backend Deployment (Node.js Hosting)

**Option 1: Vercel (Serverless)**
```bash
vercel deploy
```

**Option 2: Railway, Render, Heroku**
- Push code to GitHub
- Connect repository to hosting platform
- Set environment variables
- Auto-deploy on push

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

Configuration in `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Environment Variables for Production
Update in hosting platform:
```
MONGO_URI=production_mongodb_uri
JWT_SECRET=production_jwt_secret
OPENAI_API_KEY=production_openai_key
RAZORPAY_KEY_ID=live_razorpay_key
RAZORPAY_KEY_SECRET=live_razorpay_secret
VITE_API_BASE_URL=https://your-backend.com/api
```

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "OPENAI_API_KEY not configured" | Check .env file has OPENAI_API_KEY with valid key |
| "Microphone access denied" | Check browser permissions for microphone access |
| "Payment verification failed" | Verify Razorpay keys are in live mode, not sandbox |
| "MongoDB connection timeout" | Check MongoDB Atlas network access allows your IP |
| "JWT token expired" | User needs to login again for new token |
| "Audio format not supported" | Ensure audio is WAV, MP3, WebM, FLAC, Ogg, or M4A |

---

## 📚 Additional Documentation

- [Speech-to-Goal Pipeline](backend/SPEECH_TO_GOAL_PIPELINE.md) — Detailed AI integration guide
- [Speech Setup Guide](backend/SPEECH_SETUP.md) — OpenAI and audio setup instructions
- [Frontend README](frontend/README.md) — Frontend-specific documentation

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🙋 Support

For issues, questions, or suggestions:
- **GitHub Issues**: Open an issue on the repository
- **Email**: [Your contact email]
- **Discord**: [Community server link]

---

## 📈 Project Stats

- ✅ **Frontend**: React 19 with modern tooling (Vite, Tailwind, etc)
- ✅ **Backend**: Express with MongoDB (serverless-ready)
- ✅ **AI Features**: OpenAI Whisper + GPT-4o-mini integration
- ✅ **Payments**: Live Razorpay integration with 4 premium tiers
- ✅ **Authentication**: JWT-based with password hashing
- ✅ **Deployment**: Vercel (frontend) + any Node.js host (backend)
- ✅ **Database**: MongoDB Atlas (cloud-hosted)

---

**Last Updated**: May 4, 2026 | Latest Commit: "Integrated live and actual payment with razorpay"
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
