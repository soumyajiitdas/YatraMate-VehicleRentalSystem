const express = require('express');
const vehicleController = require('../controllers/vehicleController');

const router = express.Router();

// Specific routes must come BEFORE parameterized routes
router.get('/grouped', vehicleController.getGroupedVehicles);
router.get('/featured', vehicleController.getFeaturedVehicles);
router.get('/vendor/:vendorId', vehicleController.getVehiclesByVendor);

router
    .route('/')
    .get(vehicleController.getAllVehicles)
    .post(vehicleController.createVehicle);

router
    .route('/:id')
    .get(vehicleController.getVehicle)
    .patch(vehicleController.updateVehicle)
    .delete(vehicleController.deleteVehicle);

module.exports = router;