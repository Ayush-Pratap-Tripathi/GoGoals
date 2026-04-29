import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Crown, Zap, Loader } from 'lucide-react';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

const PremiumUpgradeModal = ({ isOpen, onClose }) => {
  const { token, user, updateUser, login } = useContext(AuthContext);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const plans = [
    {
      id: 'month1',
      duration: '1 Month',
      price: '₹500',
      features: [
        'Voice-to-Goal AI feature',
        'Monthly analytics',
        'Yearly analytics',
        'Overall analytics',
        'All premium features',
      ],
      popular: false,
    },
    {
      id: 'months3',
      duration: '3 Months',
      price: '₹1400',
      features: [
        'Voice-to-Goal AI feature',
        'Monthly analytics',
        'Yearly analytics',
        'Overall analytics',
        'All premium features',
        'Save 6.7%',
      ],
      popular: true,
    },
    {
      id: 'months6',
      duration: '6 Months',
      price: '₹2500',
      features: [
        'Voice-to-Goal AI feature',
        'Monthly analytics',
        'Yearly analytics',
        'Overall analytics',
        'All premium features',
        'Save 16.7%',
      ],
      popular: false,
    },
    {
      id: 'year1',
      duration: '1 Year',
      price: '₹4800',
      features: [
        'Voice-to-Goal AI feature',
        'Monthly analytics',
        'Yearly analytics',
        'Overall analytics',
        'All premium features',
        'Save 20%',
        'Best value',
      ],
      popular: false,
    },
  ];

  const handleUpgrade = async (planId) => {
    if (loadingPlan) return; // Prevent double-clicks
    setLoadingPlan(planId);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

      // Step 1: Create Razorpay order on backend
      const { data: orderData } = await axios.post(
        `${apiBase}/payment/create-order`,
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Step 2: Open Razorpay Checkout popup
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'GoGoals',
        description: `Premium Plan - ${orderData.planLabel}`,
        order_id: orderData.order_id,
        handler: async (response) => {
          // Step 3: Verify payment on backend
          try {
            const { data: verifyData } = await axios.post(
              `${apiBase}/payment/verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                planId,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyData.success) {
              // Update auth context with new premium status + token
              const updatedUser = verifyData.user;
              login(updatedUser, updatedUser.token);

              toast.success(verifyData.message || 'Premium activated! 🎉', {
                duration: 5000,
                style: { borderRadius: '10px', background: '#292d44', color: '#fff' },
              });
              onClose();
            }
          } catch (verifyError) {
            console.error('Payment verification failed:', verifyError);
            toast.error('Payment verification failed. Please contact support if money was deducted.', {
              duration: 6000,
              style: { borderRadius: '10px', background: '#292d44', color: '#fff' },
            });
          } finally {
            setLoadingPlan(null);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#3b82f6',
        },
        modal: {
          ondismiss: () => {
            setLoadingPlan(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        toast.error(
          `Payment failed: ${response.error.description || 'Unknown error'}`,
          {
            duration: 5000,
            style: { borderRadius: '10px', background: '#292d44', color: '#fff' },
          }
        );
        setLoadingPlan(null);
      });

      rzp.open();
    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error('Failed to initiate payment. Please try again.', {
        style: { borderRadius: '10px', background: '#292d44', color: '#fff' },
      });
      setLoadingPlan(null);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1a1f2e] border border-white/10 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#1a1f2e] border-b border-white/10 px-6 py-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">
                  Upgrade to Premium
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Subtitle */}
              <p className="text-center text-gray-300 mb-8 text-lg">
                Choose your plan and unlock all premium features
              </p>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative rounded-xl border transition-all ${
                      plan.popular
                        ? 'border-blue-400/50 bg-blue-500/5 md:scale-105 shadow-lg shadow-blue-500/20'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        Most Popular
                      </div>
                    )}

                    <div className="p-6">
                      {/* Plan Duration */}
                      <h3 className="text-xl font-bold text-white mb-2">
                        {plan.duration}
                      </h3>

                      {/* Price */}
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-white">
                          {plan.price}
                        </span>
                        <p className="text-sm text-gray-400 mt-1">
                          One-time payment
                        </p>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={loadingPlan !== null}
                        className={`w-full py-2.5 rounded-lg font-semibold transition-all mb-6 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                          plan.popular
                            ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                        }`}
                      >
                        {loadingPlan === plan.id ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Choose Plan'
                        )}
                      </button>

                      {/* Features List */}
                      <div className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 text-sm text-gray-300"
                          >
                            <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Features Comparison */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">
                  What's Included with Premium?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-white">
                        Voice-to-Goal AI
                      </p>
                      <p className="text-sm text-gray-400">
                        Convert your voice commands to goals using AI
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-white">
                        Advanced Analytics
                      </p>
                      <p className="text-sm text-gray-400">
                        Monthly, yearly, and overall analytics views
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-white">
                        Unlimited Goals
                      </p>
                      <p className="text-sm text-gray-400">
                        Create and manage unlimited goals
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-white">
                        Priority Support
                      </p>
                      <p className="text-sm text-gray-400">
                        Get priority support for any issues
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default PremiumUpgradeModal;
