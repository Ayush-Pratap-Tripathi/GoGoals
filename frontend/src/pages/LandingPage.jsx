import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
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
      {/* Global Toast Container */}
      <Toaster position="top-center" reverseOrder={false} />
      
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
      
      <main className="pt-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col gap-24 font-sans">
        <HeroSection />
        <FeaturesSection />
        <CTASection openAuthModal={openAuthModal} />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
