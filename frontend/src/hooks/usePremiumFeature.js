import { useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Custom hook to handle premium feature attempts for non-premium users
 * Provides shake animation, device vibration, and toast notification
 * 
 * @param {string} message - Custom message for the toast notification
 * @returns {Object} { isPremium, handlePremiumAttempt, elementRef }
 */
export const usePremiumFeature = (message = 'Upgrade to premium to use this feature') => {
  const { user } = useContext(AuthContext);
  const elementRef = useRef(null);
  const shakeTimeoutRef = useRef(null);

  // Trigger device vibration (mobile)
  const triggerVibration = () => {
    if (navigator.vibrate) {
      // Vibrate for 1 second
      navigator.vibrate(1000);
    }
  };

  // Apply shake animation to element
  const triggerShake = () => {
    if (elementRef.current) {
      elementRef.current.classList.add('animate-premium-shake');
      
      // Clear any previous timeout
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }

      // Remove shake class after animation completes (600ms)
      shakeTimeoutRef.current = setTimeout(() => {
        if (elementRef.current) {
          elementRef.current.classList.remove('animate-premium-shake');
        }
      }, 600);
    }
  };

  // Main handler for premium feature attempt
  const handlePremiumAttempt = (e) => {
    if (e) {
      e.stopPropagation();
    }

    if (!user?.isPremium) {
      // Trigger all three effects
      triggerShake();
      triggerVibration();
      
      // Show 1-second toast notification
      toast.error(message, {
        duration: 1000,
        style: {
          borderRadius: '10px',
          background: '#292d44',
          color: '#fff',
          fontWeight: '600',
        },
        icon: '🔒',
      });

      return false; // Indicate feature is locked
    }

    return true; // Feature is available
  };

  return {
    isPremium: user?.isPremium || false,
    handlePremiumAttempt,
    elementRef,
  };
};

export default usePremiumFeature;
