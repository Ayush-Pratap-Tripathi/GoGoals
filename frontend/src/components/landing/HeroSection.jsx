import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import cover1 from '../../assets/cover1.png';

const HeroSection = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between gap-12 py-10 lg:pt-16 min-h-[85vh]">
      
      {/* Text Container (Left) */}
      <motion.div 
        className="flex-1 space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
          Welcome to <br />
          <span className="text-white">GoGoals</span>
        </h1>
        <h2 className="text-sm sm:text-base md:text-lg uppercase tracking-widest text-gray-300 border-b border-gray-600 pb-4 inline-block">
          PERSONAL GOAL TRACKER
        </h2>
        
        <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-lg mt-4">
          Welcome to GoGoals, where we are passionate about helping you <strong>achieve your dreams</strong>. Our team combines expertise in goal-setting and app development to create an intuitive platform. We believe that tracking progress is essential for personal growth, empowering you to reach new heights in your journey.
        </p>

        <div className="pt-6 w-full lg:w-auto flex justify-center lg:justify-start">
          <button 
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' })}
            className="flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3 sm:px-8 border border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#292d44] transition-all duration-300 font-semibold group rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]"
          >
            Read More
            <ArrowDown className="hidden lg:block w-5 h-5 group-hover:translate-y-1 transition-transform" />
            <ArrowRight className="block lg:hidden w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="pt-4">
          <span className="italic font-serif text-xl tracking-wider">Est. 2026</span>
        </div>
      </motion.div>

      {/* Image Container (Right) */}
      <motion.div 
        className="hidden lg:flex flex-1 justify-center lg:justify-end"
        initial={{ opacity: 0, x: 50, scale: 0.9 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <img 
          src={cover1} 
          alt="GoGoals Journey Graphic" 
          className="w-full max-w-lg lg:max-w-xl object-contain drop-shadow-2xl rounded-2xl"
        />
      </motion.div>

    </section>
  );
};
export default HeroSection;
