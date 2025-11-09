const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router
    .route('/')
    .get(restrictTo('admin', 'office_staff'), userController.getAllUsers)
    .post(restrictTo('admin'), userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(restrictTo('admin'), userController.deleteUser);

module.exports = router;
