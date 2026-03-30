import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="relative pb-24"> {/* pb-24 provides space for the fixed footer so it doesn't overlap text */}
      <Navbar />
      
      <main className="pt-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col gap-24 font-sans">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
