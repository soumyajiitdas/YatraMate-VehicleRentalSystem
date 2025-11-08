const express = require('express');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// Customer routes
router.post('/request', bookingController.createBookingRequest);
router.get('/user/:userId', bookingController.getUserBookings);

// Office staff routes
router.get('/office-staff/requests', bookingController.getOfficeStaffRequests);
router.patch('/:bookingId/pickup', bookingController.confirmPickup);
router.patch('/:bookingId/return', bookingController.confirmReturn);

// General routes
router
    .route('/')
    .get(bookingController.getAllBookings);

router
    .route('/:id')
    .get(bookingController.getBooking)
    .delete(bookingController.cancelBooking);

module.exports = router;
