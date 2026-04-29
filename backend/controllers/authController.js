import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Goal from '../models/Goal.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        isPremium: user.isPremium,
        premiumExpiryDate: user.premiumExpiryDate,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        isPremium: user.isPremium,
        premiumExpiryDate: user.premiumExpiryDate,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Update user name
// @route   PUT /api/auth/profile/name
// @access  Private
export const updateName = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is missing or invalid content-type. Please use application/json.' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      if (req.body.name) {
        user.name = req.body.name;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        isPremium: updatedUser.isPremium,
        premiumExpiryDate: updatedUser.premiumExpiryDate,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile picture
// @route   PUT /api/auth/profile/avatar
// @access  Private
export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is missing or invalid content-type. Please use application/json.' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      if (req.body.profilePicture !== undefined) {
        user.profilePicture = req.body.profilePicture;
      } else {
        return res.status(400).json({ message: "profilePicture field is required." });
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,        isPremium: updatedUser.isPremium,
        premiumExpiryDate: updatedUser.premiumExpiryDate,        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user account and data
// @route   DELETE /api/auth/profile
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to delete account' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Incorrect password, you have been logged out.' });
    }

    // Must delete all goals related to this user first
    await Goal.deleteMany({ user: req.user._id });

    // Then delete user
    await user.deleteOne();

    res.status(200).json({ message: 'Account and associated data deleted securely.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
