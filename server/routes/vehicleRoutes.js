const express = require('express');
const vehicleController = require('../controllers/vehicleController');

const router = express.Router();

router
    .route('/')
    .get(vehicleController.getAllVehicles)
    .post(vehicleController.createVehicle);

router.get('/vendor/:vendorId', vehicleController.getVehiclesByVendor);

router
    .route('/:id')
    .get(vehicleController.getVehicle)
    .patch(vehicleController.updateVehicle)
    .delete(vehicleController.deleteVehicle);

module.exports = router;