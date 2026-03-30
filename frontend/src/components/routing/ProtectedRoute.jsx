import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#292d44] flex items-center justify-center">
        <img src={logo} alt="Loading..." className="w-16 h-16 animate-pulse opacity-50" />
      </div>
    );
  }

  // Intercept unauthorized access seamlessly pushing to landing page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
