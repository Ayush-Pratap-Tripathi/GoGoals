import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import MyGoalsPage from './pages/MyGoalsPage';
import ProfilePage from './pages/ProfilePage';

// PublicRoute automatically kicks logged-in users away from the Landing Page
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  
  if (isLoading) return null; // Avoid UI flash while awaiting validation ping
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  
  return children;
};

// Extracted routes wrapper to consume context safely
const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-[#292d44] text-white">
      <Routes>
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/goals" 
          element={
            <ProtectedRoute>
              <MyGoalsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
