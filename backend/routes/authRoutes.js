import express from 'express';
import { registerUser, loginUser, getMe, updateName, updateProfilePicture, deleteAccount } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile/name', protect, updateName);
router.put('/profile/avatar', protect, updateProfilePicture);
router.delete('/profile', protect, deleteAccount);

export default router;
