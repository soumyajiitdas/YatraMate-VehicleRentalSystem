const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/register-vendor', authController.registerVendor);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protected routes
router.use(protect);

router.get('/me', authController.getCurrentUser);
router.patch('/update-password', authController.updatePassword);
router.patch('/update-profile', authController.updateProfile);

module.exports = router;
