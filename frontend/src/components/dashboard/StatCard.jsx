import { motion } from 'framer-motion';

const StatCard = ({ title, completed = 0, total = 0, score = "0.00", onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="flex-1 w-full bg-[#2d3250] border-t-2 border-blue-400 rounded-xl overflow-hidden flex flex-col items-center justify-center py-12 md:py-16 shadow-2xl relative min-h-[220px] cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-blue-300 transition-all duration-300 group"
    >
      <div className="bg-[#292d44]/70 w-full text-center py-2 absolute top-0 text-base md:text-lg font-bold text-gray-200 tracking-wider uppercase shadow-sm">
        {title}
      </div>
      
      <div className="mt-8 flex items-baseline gap-1.5 relative z-10 transition-all duration-300 group-hover:scale-105">
        <span className="text-6xl md:text-7xl font-extrabold text-white group-hover:scale-110 transition-transform duration-300">{completed}</span>
        <span className="text-4xl md:text-5xl font-bold text-white/40 group-hover:text-white/60 transition-colors duration-300">/{total}</span>
      </div>
      
      <p className="text-xs md:text-sm text-gray-400 mt-2 font-medium tracking-wide uppercase">Completed</p>
      
      <div className="mt-5 pt-4 border-t border-white/10 w-4/5 text-center">
        <span className="text-gray-300 text-sm md:text-base font-medium">Score: <span className="text-white font-bold ml-1">{score}</span></span>
      </div>
    </motion.div>
  );
};

export default StatCard;
