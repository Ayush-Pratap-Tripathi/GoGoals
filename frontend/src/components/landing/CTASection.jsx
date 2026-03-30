import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section id="cta" className="flex flex-col items-center justify-center text-center gap-10 py-32 mt-10">
      
      <motion.div
        className="space-y-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
          Start your Journey now!
        </h2>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Big results don't come from big efforts once. <br className="hidden md:block" />
          They come from small efforts repeated every day.
        </p>

        <div className="pt-8">
          <Link to="/signup">
            <button className="px-14 py-4 rounded-full border border-white/20 bg-white/10 text-white text-xl font-bold hover:bg-white hover:text-[#292d44] transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]">
              Get Started
            </button>
          </Link>
        </div>
      </motion.div>

    </section>
  );
};
export default CTASection;
