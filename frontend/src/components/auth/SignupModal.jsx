import { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const SignupModal = ({ isOpen, onClose, switchToLogin }) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    try {
      const response = await axios.post(`${apiBase}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      const userData = {
        id: response.data._id,
        name: response.data.name,
        email: response.data.email
      };

      // Set global auth state and persist JWT
      login(userData, response.data.token);

      toast.success('User registered successfully!', {
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: '#292d44',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.2)',
        },
        iconTheme: { primary: '#eab308', secondary: '#292d44' },
      });

      onClose();
      navigate('/dashboard');
    } catch (error) {
      console.error("Auth Error:", error);
      const message = error.response?.data?.message || 'An error occurred. Please try again.';
      toast.error(message, {
        duration: 4000,
        style: { borderRadius: '10px', background: '#ef4444', color: '#fff' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop blur overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md bg-[#2d3250]/90 border border-white/20 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
        >
          {/* Close Button */}
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="GoGoals Logo" className="w-14 h-14 object-contain mb-3" />
            <h2 className="text-3xl font-extrabold text-white tracking-wide">
              Join GoGoals
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Join to start tracking your goals
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-300 font-medium ml-1">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required 
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/50 transition-all font-sans"

              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-300 font-medium ml-1">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required 
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/50 transition-all font-sans"

              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-300 font-medium ml-1">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required 
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/50 transition-all font-sans"

              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-4 w-full py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white hover:text-[#292d44] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Processing...' : 'Sign Up'}
            </button>
          </form>

          {/* Toggle Register/Login */}
          <div className="mt-6 text-center text-sm text-gray-300">
            <p>
              Registered already?{' '}
              <button type="button" onClick={switchToLogin} className="text-yellow-400 font-semibold hover:underline cursor-pointer hover:text-yellow-300 transition-colors">
                Login
              </button>
            </p>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SignupModal;
