import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const StatCard = ({ title, completed = 0, total = 0, score = "0.00", onClick, isPremium = true }) => {
  const [isShaking, setIsShaking] = useState(false);

  const handleLockClick = (e) => {
    e.stopPropagation();
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
    toast.error('Upgrade to premium to use this feature', {
      style: { borderRadius: '10px', background: '#292d44', color: '#fff' }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`h-full w-full bg-[#2d3250] border-t-2 border-blue-400 rounded-xl overflow-hidden flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 lg:py-16 shadow-2xl relative min-h-[150px] md:min-h-[220px] lg:min-h-[260px] cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-blue-300 transition-all duration-300 group ${!isPremium ? 'blur-sm' : ''} ${isShaking ? 'animate-premium-shake' : ''}`}
    >
      <div className="bg-[#292d44]/70 w-full text-center py-2 absolute top-0 text-base md:text-lg font-bold text-gray-200 tracking-wider uppercase shadow-sm">
        {title}
      </div>
      
      <div className="mt-8 flex items-baseline gap-1.5 relative z-10 transition-all duration-300 group-hover:scale-105">
        <span className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white group-hover:scale-110 transition-transform duration-300">{completed}</span>
        <span className="text-xl sm:text-3xl md:text-5xl font-bold text-white/40 group-hover:text-white/60 transition-colors duration-300">/{total}</span>
      </div>
      
      <p className="text-xs md:text-sm text-gray-400 mt-2 font-medium tracking-wide uppercase">Completed</p>
      
      <div className="mt-5 pt-4 border-t border-white/10 w-4/5 text-center">
        <span className="text-gray-300 text-sm md:text-base font-medium">Score: <span className="text-white font-bold ml-1">{score}</span></span>
      </div>

      {/* Premium Lock Overlay - Show on all devices */}
      {!isPremium && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors z-20"
          onClick={handleLockClick}
        >
          <Lock className="w-8 h-8 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default StatCard;
