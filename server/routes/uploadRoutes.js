const express = require('express');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

// Get ImageKit auth parameters for client-side upload
router.get('/auth', uploadController.getAuthParameters);

// Upload file to ImageKit (server-side)
router.post(
    '/file',
    uploadController.multerUpload.single('file'),
    uploadController.uploadFile
);

// Upload multiple files to ImageKit
router.post(
    '/files',
    uploadController.multerUpload.array('files', 10),
    uploadController.uploadMultipleFiles
);

module.exports = router;