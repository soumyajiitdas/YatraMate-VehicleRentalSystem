const express = require('express');
const vehicleRequestController = require('../controllers/vehicleRequestController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router
    .route('/')
    .get(protect, restrictTo('admin'), vehicleRequestController.getAllVehicleRequests)
    .post(protect, restrictTo('vendor'), vehicleRequestController.createVehicleRequest);

router
    .route('/:id')
    .get(protect, vehicleRequestController.getVehicleRequest)
    .delete(protect, restrictTo('admin', 'vendor'), vehicleRequestController.deleteVehicleRequest);

router
    .route('/:id/approve')
    .patch(protect, restrictTo('admin'), vehicleRequestController.approveVehicleRequest);

router
    .route('/:id/reject')
    .patch(protect, restrictTo('admin'), vehicleRequestController.rejectVehicleRequest);

router
    .route('/vendor/:vendorId')
    .get(protect, vehicleRequestController.getVehicleRequestsByVendor);

module.exports = router;
