const express = require('express');
const vehicleRequestController = require('../controllers/vehicleRequestController');

const router = express.Router();

router
    .route('/')
    .get(vehicleRequestController.getAllVehicleRequests)
    .post(vehicleRequestController.createVehicleRequest);

router
    .route('/:id')
    .get(vehicleRequestController.getVehicleRequest)
    .delete(vehicleRequestController.deleteVehicleRequest);

router
    .route('/:id/approve')
    .patch(vehicleRequestController.approveVehicleRequest);

router
    .route('/:id/reject')
    .patch(vehicleRequestController.rejectVehicleRequest);

router
    .route('/vendor/:vendorId')
    .get(vehicleRequestController.getVehicleRequestsByVendor);

module.exports = router;
