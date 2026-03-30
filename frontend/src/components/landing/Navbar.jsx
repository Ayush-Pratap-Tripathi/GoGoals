import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const location = useLocation();

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      // Scroll smoothly to top without refreshing
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-[#292d44]/80 border-b border-white/10"
    >
      <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 group cursor-pointer">
        <img src={logo} alt="GoGoals Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" />
        <span className="text-2xl font-bold tracking-wide group-hover:text-yellow-400 transition-colors duration-300">GoGoals</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/login">
          <button className="px-6 py-2 rounded-full border border-white/20 bg-white/10 text-white font-medium hover:bg-white hover:text-[#292d44] transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            Log in
          </button>
        </Link>
        <Link to="/signup">
          <button className="px-6 py-2 rounded-full border border-white/20 bg-white/10 text-white font-medium hover:bg-white hover:text-[#292d44] transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            SignUp
          </button>
        </Link>
      </div>
    </motion.nav>
  );
};
export default Navbar;
