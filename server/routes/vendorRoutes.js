const express = require('express');
const vendorController = require('../controllers/vendorController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Public route for vendor registration moved to authRoutes
router
    .route('/')
    .get(protect, restrictTo('admin', 'office_staff'), vendorController.getAllVendors);

// Protect all routes after this middleware
router.use(protect);

router.get('/earnings', restrictTo('vendor'), vendorController.getVendorEarnings);

router.patch('/:id/verify', restrictTo('admin', 'office_staff'), vendorController.verifyVendor);

router
    .route('/:id')
    .get(vendorController.getVendor)
    .patch(vendorController.updateVendor)
    .delete(restrictTo('admin'), vendorController.deleteVendor);

module.exports = router;