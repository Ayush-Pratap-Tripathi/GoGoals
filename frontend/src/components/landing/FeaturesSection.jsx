import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import cover2 from '../../assets/cover2.png';
import logo from '../../assets/logo.png';

const FeaturesSection = () => {
  return (
    <section id="features" className="flex flex-col items-center justify-center py-10 lg:mt-20 lg:mb-20 min-h-[85vh]">
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full pb-8">
        {/* Text Container (Left) */}
        <motion.div 
          className="flex-1 space-y-6"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="Logo icon" className="w-8 h-8 opacity-80" />
            <span className="text-xl font-bold tracking-wide text-gray-200">GoGoals</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold pb-6">
            What is GoGoals?
          </h2>

          <ul className="text-sm sm:text-base md:text-lg text-gray-300 space-y-4 max-w-lg list-disc ml-6 marker:text-yellow-400 leading-snug">
            <li>Organize goals into daily, weekly, monthly, yearly, and bucket list categories</li>
            <li>Track your progress with visual graphs and performance insights</li>
            <li>Mark goals as complete, delete them, and monitor behavioral patterns</li>
            <li>Maintain a personal achievement history to stay motivated</li>
            <li>Build consistency through structured tracking and reflection</li>
            <li>Turn scattered plans into clear, measurable progress</li>
          </ul>
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
            src={cover2} 
            alt="GoGoals Dashboard Features Dashboard" 
            className="w-full max-w-lg lg:max-w-xl object-contain drop-shadow-2xl rounded-2xl"
          />
        </motion.div>
      </div>

      {/* Centered Scroll Down Button */}
      <motion.button 
        onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' })}
        className="mt-6 p-4 rounded-full border border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#292d44] transition-all duration-300 group hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <ArrowDown className="hidden lg:block w-6 h-6 group-hover:translate-y-1 transition-transform" />
        <ArrowRight className="block lg:hidden w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </motion.button>

    </section>
  );
};
export default FeaturesSection;
