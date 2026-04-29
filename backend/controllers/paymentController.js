import Razorpay from 'razorpay';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Lazy-init Razorpay (env vars aren't available at import time)
let razorpayInstance = null;
const getRazorpay = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

// Plan configuration — maps planId to amount (in paise) and duration
const PLAN_CONFIG = {
  month1: { amount: 50000, label: '1 Month', months: 1 },
  months3: { amount: 140000, label: '3 Months', months: 3 },
  months6: { amount: 250000, label: '6 Months', months: 6 },
  year1: { amount: 480000, label: '1 Year', months: 12 },
};

// Generate JWT (same helper as authController)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Create a Razorpay order for a premium plan
// @route   POST /api/payment/create-order
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId || !PLAN_CONFIG[planId]) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    const plan = PLAN_CONFIG[planId];

    const options = {
      amount: plan.amount, // Amount in paise
      currency: 'INR',
      receipt: `gg_${req.user._id.toString().slice(-8)}_${Date.now().toString(36)}`,
      notes: {
        userId: req.user._id.toString(),
        planId: planId,
        planLabel: plan.label,
      },
    };

    const order = await getRazorpay().orders.create(options);

    res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      planId,
      planLabel: plan.label,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500).json({ message: 'Failed to create payment order', error: error.message });
  }
};

// @desc    Verify Razorpay payment signature and activate premium
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, planId } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !planId) {
      return res.status(400).json({ message: 'Missing payment verification fields' });
    }

    if (!PLAN_CONFIG[planId]) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    // Step 1: Verify HMAC SHA256 signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed — invalid signature' });
    }

    // Step 2: Signature is valid — activate premium for the user
    const plan = PLAN_CONFIG[planId];
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate expiry date from today (or extend from current expiry if already premium)
    const now = new Date();
    const baseDate = user.isPremium && user.premiumExpiryDate && user.premiumExpiryDate > now
      ? new Date(user.premiumExpiryDate)
      : now;

    const expiryDate = new Date(baseDate);
    expiryDate.setMonth(expiryDate.getMonth() + plan.months);

    user.isPremium = true;
    user.premiumExpiryDate = expiryDate;
    await user.save();

    // Step 3: Return updated user data with a fresh token
    res.status(200).json({
      success: true,
      message: `Premium activated! Your plan: ${plan.label}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        isPremium: user.isPremium,
        premiumExpiryDate: user.premiumExpiryDate,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error('Payment verification failed:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
};
