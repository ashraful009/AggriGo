import express from 'express';
import {
  login,
  register,
  getMe,
  logout,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected route
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;