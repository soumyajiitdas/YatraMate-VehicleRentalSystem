const express = require('express');
const bookingController = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Customer routes
router.post('/request', protect, restrictTo('user'), bookingController.createBookingRequest);
router.get('/user/:userId', protect, bookingController.getUserBookings);

// Office staff routes
router.get('/office-staff/requests', protect, restrictTo('office_staff'), bookingController.getOfficeStaffRequests);
router.patch('/:bookingId/pickup', protect, restrictTo('office_staff'), bookingController.confirmPickup);
router.patch('/:bookingId/return', protect, restrictTo('office_staff'), bookingController.confirmReturn);

// General routes
router
    .route('/')
    .get(protect, restrictTo('admin'), bookingController.getAllBookings);

router
    .route('/:id')
    .get(protect, bookingController.getBooking)
    .delete(protect, bookingController.cancelBooking);

module.exports = router;
