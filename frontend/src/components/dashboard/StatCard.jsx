import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import usePremiumFeature from "../../hooks/usePremiumFeature";

const StatCard = ({
  title,
  completed = 0,
  total = 0,
  score = "0.00",
  onClick,
  isPremium = true,
}) => {
  const { handlePremiumAttempt, elementRef } = usePremiumFeature("Upgrade to premium to access this analytics");

  const handleCardClick = (e) => {
    if (!isPremium) {
      handlePremiumAttempt(e);
      return;
    }
    if (onClick) onClick();
  };

  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleCardClick}
      className={`h-full w-full bg-[#2d3250] border-t-2 border-blue-400 rounded-xl overflow-hidden flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 lg:py-16 shadow-2xl relative min-h-[150px] md:min-h-[220px] lg:min-h-[260px] cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-blue-300 transition-all duration-300 group ${
        !isPremium ? "blur-sm" : ""
      }`}
    >
      <div className="bg-[#292d44]/70 w-full text-center py-2 absolute top-0 text-base md:text-lg font-bold text-gray-200 tracking-wider uppercase shadow-sm">
        {title}
      </div>

      <div className="mt-8 flex items-baseline gap-1.5 relative z-10 transition-all duration-300 group-hover:scale-105">
        <span className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white group-hover:scale-110 transition-transform duration-300">
          {completed}
        </span>
        <span className="text-xl sm:text-3xl md:text-5xl font-bold text-white/40 group-hover:text-white/60 transition-colors duration-300">
          /{total}
        </span>
      </div>

      <p className="text-xs md:text-sm text-gray-400 mt-2 font-medium tracking-wide uppercase">
        Completed
      </p>

      <div className="mt-5 pt-4 border-t border-white/10 w-4/5 text-center">
        <span className="text-gray-300 text-sm md:text-base font-medium">
          Score: <span className="text-white font-bold ml-1">{score}</span>
        </span>
      </div>

      {/* Lock Overlay for Non-Premium */}
      {!isPremium && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-lg cursor-not-allowed hover:bg-black/30 transition-colors"
          onClick={handlePremiumAttempt}
        >
          <div className="flex flex-col items-center gap-2">
            <Lock size={32} className="text-yellow-400" />
            <span className="text-sm font-semibold text-white">Locked</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
