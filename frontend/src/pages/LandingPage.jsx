import { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';
import LoginModal from '../components/auth/LoginModal';
import SignupModal from '../components/auth/SignupModal';

const LandingPage = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openAuthModal = (mode) => {
    if (mode === 'login') {
      setIsSignupOpen(false);
      setIsLoginOpen(true);
    } else {
      setIsLoginOpen(false);
      setIsSignupOpen(true);
    }
  };

  return (
    <div className="relative pb-24">

      
      {/* Separate Decoupled Modals */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        switchToSignup={() => openAuthModal('signup')}
      />

      <SignupModal 
        isOpen={isSignupOpen} 
        onClose={() => setIsSignupOpen(false)} 
        switchToLogin={() => openAuthModal('login')}
      />

      <Navbar openAuthModal={openAuthModal} />
      
      <main className="pt-24 max-w-7xl mx-auto flex flex-row overflow-x-auto overflow-y-hidden lg:flex-col lg:overflow-visible snap-x snap-mandatory lg:snap-none gap-0 lg:gap-24 font-sans [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="w-full shrink-0 snap-center min-w-full px-4 sm:px-6 md:px-12 lg:px-24">
          <HeroSection />
        </div>
        <div className="w-full shrink-0 snap-center min-w-full px-4 sm:px-6 md:px-12 lg:px-24">
          <FeaturesSection />
        </div>
        <div className="w-full shrink-0 snap-center min-w-full px-4 sm:px-6 md:px-12 lg:px-24">
          <CTASection openAuthModal={openAuthModal} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
