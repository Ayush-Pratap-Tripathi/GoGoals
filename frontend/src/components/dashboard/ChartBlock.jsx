import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

const ChartBlock = ({ title, data, onPrevious, onNext, isPremium = true }) => {
  const swipeLockRef = useRef(false);
  const [direction, setDirection] = useState(1); // 1 for Next, -1 for Prev
  const [isShaking, setIsShaking] = useState(false);

  const handleNext = () => {
    setDirection(1);
    if (onNext) onNext();
  };

  const handlePrev = () => {
    setDirection(-1);
    if (onPrevious) onPrevious();
  };

  // Captures Physical OS Trackpad two-finger swipes via deltaX limits
  const handleWheel = (e) => {
    // Only capture explicit horizontal drag interactions ignoring standard scroll
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault(); // Prevents standard browser back/forward swipe history conflicts inside mapping
      
      if (swipeLockRef.current) return;
      
      if (e.deltaX > 25) {
        swipeLockRef.current = true;
        handleNext();
        setTimeout(() => { swipeLockRef.current = false; }, 500); // Prevents infinite fast-forward tracking
      } else if (e.deltaX < -25) {
        swipeLockRef.current = true;
        handlePrev();
        setTimeout(() => { swipeLockRef.current = false; }, 500);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      className="w-full flex flex-col pt-4 pb-8 overflow-hidden"
    >
      {/* UI Interactor Title Strip */}
      <div className="w-full mb-6 flex items-center justify-center gap-4 md:gap-8 z-10">
        <button 
          onClick={handlePrev}
          className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-full transition-transform active:scale-90 outline-none cursor-pointer text-gray-400 hover:text-[#3b82f6] shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          title="Slide Previous"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5}/>
        </button>

        <h3 className="text-xl md:text-2xl font-bold tracking-wide italic text-gray-200 min-w-[160px] md:min-w-[200px] text-center select-none transition-all">
          <span className="font-[cursive]">{title}</span>
        </h3>

        <button 
          onClick={handleNext}
          className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-full transition-transform active:scale-90 outline-none cursor-pointer text-gray-400 hover:text-[#3b82f6] shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          title="Slide Next"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </button>
      </div>

      {/* Chart Canvas utilizing Recharts and Native OS Trackpad Events strictly bound to Y:10 */}
      <div 
        className={`h-64 md:h-[400px] w-full touch-pan-x cursor-grab active:cursor-grabbing relative ${isShaking ? 'animate-premium-shake' : ''}`}
        onWheel={handleWheel}
      >
        {/* STATIC Y-AXIS UNDERLAY (Never Animates, strictly fixed natively) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              {/* Hide X axis and bars, only mapping the fixed Y tracking column */}
              <XAxis dataKey="name" hide={true} />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                domain={[0, 10]} 
                ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} 
              />
              {/* A Bar is required for Recharts to calculate and render the Cartesian layout properly */}
              <Bar dataKey="value" fill="transparent" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DYNAMIC X-AXIS & BARS PIPELINE (Slides Horizontally natively over the static layer) */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={title + JSON.stringify(data[0])}
            custom={direction}
            initial={{ opacity: 0, x: direction === 1 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 1 ? -50 : 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`absolute inset-0 w-full h-full z-10 ${!isPremium ? 'blur-sm' : ''}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                
                {/* Transparent Y Axis forcing structural grid alignment perfectly but rendering invisible natively */}
                <YAxis 
                  stroke="transparent" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  domain={[0, 10]} 
                  ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} 
                  tick={{ fill: 'transparent' }}
                />
                
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#2d3250', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontWeight: 'bold', zIndex: 100 }}
                  formatter={(value) => [`${value} / 10 Score`, "Performance"]}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>

        {/* Premium Lock Overlay */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm z-20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors"
            onClick={() => {
              setIsShaking(true);
              setTimeout(() => setIsShaking(false), 600);
              toast.error('Upgrade to premium to use this feature', {
                style: { borderRadius: '10px', background: '#292d44', color: '#fff' }
              });
            }}
          >
            <Lock className="w-8 h-8 text-white" />
          </motion.div>
        )}
      </div>

    </motion.div>
  );
};

export default ChartBlock;
