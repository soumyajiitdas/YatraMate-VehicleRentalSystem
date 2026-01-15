const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/register-vendor', authController.registerVendor);
router.post('/verify-vendor-otp', authController.verifyVendorOTP);
router.post('/resend-vendor-otp', authController.resendVendorOTP);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.use(protect);

router.get('/me', authController.getCurrentUser);
router.patch('/update-password', authController.updatePassword);
router.patch('/update-profile', authController.updateProfile);
router.post('/request-password-change-otp', authController.requestPasswordChangeOTP);
router.post('/verify-password-change-otp', authController.verifyPasswordChangeOTP);
router.post('/resend-password-change-otp', authController.resendPasswordChangeOTP);

module.exports = router;
