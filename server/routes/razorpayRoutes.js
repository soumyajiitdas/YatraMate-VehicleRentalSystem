const express = require('express');
const razorpayController = require('../controllers/razorpayController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get Razorpay key for frontend
router.get('/key', razorpayController.getRazorpayKey);

// Protected routes (require authentication)
router.use(protect);

// Advance payment routes
router.post('/create-advance-order', razorpayController.createAdvancePaymentOrder);
router.post('/verify-advance-payment', razorpayController.verifyAdvancePayment);

// Final payment routes
router.post('/create-final-order', razorpayController.createFinalPaymentOrder);
router.post('/verify-final-payment', razorpayController.verifyFinalPayment);

module.exports = router;
