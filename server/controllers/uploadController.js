const ImageKit = require('imagekit');
const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024       // 10MB limit
    }
});

// Get ImageKit authentication parameters
exports.getAuthParameters = catchAsync(async (req, res, next) => {
    const result = imagekit.getAuthenticationParameters();
    res.status(200).json(result);
});

// Upload file to ImageKit
exports.uploadFile = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please upload a file', 400));
    }

    const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: '/vendor-documents'
    });

    res.status(200).json({
        status: 'success',
        data: {
            url: result.url,
            fileId: result.fileId,
            name: result.name
        }
    });
});

// Export multer upload middleware
exports.multerUpload = upload;