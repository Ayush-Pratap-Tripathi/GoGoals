# GoGoals 🎯

A full-stack web application for goal tracking and management with user authentication, profile customization, and real-time analytics.

## 🌟 Features

- **User Authentication**: Secure signup/login with JWT tokens and bcrypt password hashing
- **Goal Management**: Create, update, delete, and track personal goals
- **Progress Analytics**: Visual dashboards with charts and statistics
- **Bucket List**: Organize and manage life goals in a bucket list format
- **User Profiles**: Customize profile with name and profile picture (with image cropping)
- **Secure Account Deletion**: Multi-step account deletion with password verification
- **Responsive Design**: Beautiful UI optimized for desktop and mobile
- **Real-time Updates**: Instant synchronization of data across the app

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

### Backend
- **Node.js** with Express 5
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **CORS** for cross-origin requests
- **Dotenv** for environment variables

## 📁 Project Structure

```
GoGoals/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   └── goalController.js     # Goal operations
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT protection
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Goal.js               # Goal schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── goalRoutes.js         # Goal endpoints
│   ├── server.js                 # Express app
│   ├── seedDummyData.js          # Sample data
│   ├── package.json
│   └── .env                      # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/             # Login/Signup modals
│   │   │   ├── dashboard/        # Dashboard components
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

### Goal Management
- Create goals with descriptions and categories
- Update goal progress and status
- Delete goals with confirmation
- Filter and sort goals
- Real-time goal statistics

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

## 🚢 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Backend (Render)
1. Create account on deployment platform
2. Connect MongoDB Atlas database
3. Set environment variables
4. Deploy from GitHub

### Key Configuration Files
- `frontend/vercel.json` - Vercel routing configuration (SPA fallback)
- `backend/server.js` - CORS configured for all origins

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

## 📝 License

This project is licensed under the ISC License - see LICENSE file for details.

## 👨‍💻 Author

**Ayush Pratap**

## 🙏 Acknowledgments

- [React](https://react.dev) - UI library
- [Express](https://expressjs.com) - Backend framework
- [MongoDB](https://www.mongodb.com) - Database
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Vite](https://vitejs.dev) - Build tool
- [Framer Motion](https://www.framer.com/motion) - Animations

## 📞 Support

For support or questions, please open an issue on GitHub or contact the author.

---

**Last Updated**: April 2026  
**Version**: 1.0.0
