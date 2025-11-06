const express = require('express');
const vendorController = require('../controllers/vendorController');

const router = express.Router();

router
    .route('/')
    .get(vendorController.getAllVendors)
    .post(vendorController.createVendor);

router
    .route('/:id')
    .get(vendorController.getVendor)
    .patch(vendorController.updateVendor)
    .delete(vendorController.deleteVendor);

module.exports = router;
