import logo from '../../assets/logo.png';
import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { UserCircle2, LogOut, Settings, Target, ListChecks } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import BucketListModal from './BucketListModal';

const DashboardNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBucketModalOpen, setIsBucketModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Extract first name dynamically from auth payload (split by space)
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  // Native JS real-time parsing bounds clock exactly to user's localized zone instantly
  const today = new Date();
  const weekDay = today.toLocaleDateString('en-US', { weekday: 'long' }); 
  const dateStr = today.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  }).replace(/ /g, '-'); 

  // Mount passive listener closing dropdown on arbitrary off-clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between w-full py-4 max-w-7xl mx-auto relative z-50"
      >
      {/* Left: Responsive Clickable Logo */}
      <Link to="/" className="flex items-center gap-2 group cursor-pointer transition-all outline-none">
        <img 
          src={logo} 
          alt="GoGoals Logo" 
          className="w-10 h-auto object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md" 
        />
        <span className="hidden sm:block text-xl font-bold tracking-wide group-hover:text-yellow-400 transition-colors duration-300 drop-shadow-md text-white">
          GoGoals
        </span>
      </Link>

      {/* Middle: Welcome Text bound to real-time clock evaluation */}
      <div className="flex flex-col items-center">
        <h2 className="text-lg md:text-xl font-bold tracking-wide italic text-white">
          <span className="font-[cursive]">Welcome {firstName} ✨</span>
        </h2>
        <span className="text-xs md:text-sm text-gray-400 font-medium tracking-widest uppercase mt-0.5">
          {weekDay}
        </span>
      </div>

      {/* Right: Date & Interactive Profile Dropdown Stack */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <span className="text-sm font-medium text-gray-300 hidden sm:block">
          {dateStr}
        </span>
        
        <div 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all outline-none border overflow-hidden ${isDropdownOpen ? 'bg-white/20 border-white/40 scale-105' : 'bg-white/10 border-transparent hover:bg-white/20 hover:border-white/30 hover:scale-105 active:scale-95'}`}
        >
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <UserCircle2 className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Floating Glassmorphic Dropdown Menu */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 top-[120%] w-56 bg-[#2d3250]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-[100] flex flex-col origin-top-right"
            >
              {/* User Metadata Header */}
              <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email || 'user@example.com'}</p>
              </div>

              {/* Action Routes */}
              <div className="flex flex-col py-2">
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/goals');
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-3 outline-none"
                >
                  <Target className="w-4 h-4 text-blue-400" />
                  My Goals
                </button>
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsBucketModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-3 outline-none"
                >
                  <ListChecks className="w-4 h-4 text-purple-400" />
                  Bucket List
                </button>
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-3 outline-none"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  Edit Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-3 outline-none"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.nav>
    <BucketListModal isOpen={isBucketModalOpen} onClose={() => setIsBucketModalOpen(false)} />
    </>
  );
};

export default DashboardNavbar;
