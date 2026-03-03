import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, logout, getMe, forgotPassword, resetPassword, verifyOTP, resendOTP } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// --- Rate Limiters ---

// Login: max 5 failed attempts per IP per 15 minutes
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    skipSuccessfulRequests: true, // only count failed (non-2xx) responses
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false
});

// Resend OTP: max 3 requests per IP per 10 minutes
const resendOtpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3,
    message: {
        success: false,
        message: 'Too many OTP requests. Please try again after 10 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// --- Routes ---
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOtpLimiter, resendOTP);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;
