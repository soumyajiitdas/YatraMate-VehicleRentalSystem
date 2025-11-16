const ImageKit = require('imagekit');
const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Initialize ImageKit only if credentials are provided
let imagekit = null;
if (process.env.IMAGEKIT_PUBLIC_KEY && 
    process.env.IMAGEKIT_PRIVATE_KEY && 
    process.env.IMAGEKIT_URL_ENDPOINT &&
    process.env.IMAGEKIT_PUBLIC_KEY !== 'placeholder') {
    imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
}

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
    if (!imagekit) {
        return next(new AppError('ImageKit is not configured', 500));
    }
    const result = imagekit.getAuthenticationParameters();
    res.status(200).json(result);
});

// Upload file to ImageKit
exports.uploadFile = catchAsync(async (req, res, next) => {
    if (!imagekit) {
        return next(new AppError('ImageKit is not configured', 500));
    }
    
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

// Upload multiple files to ImageKit
exports.uploadMultipleFiles = catchAsync(async (req, res, next) => {
    if (!imagekit) {
        return next(new AppError('ImageKit is not configured', 500));
    }
    
    if (!req.files || req.files.length === 0) {
        return next(new AppError('Please upload at least one file', 400));
    }

    const uploadPromises = req.files.map(file => 
        imagekit.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: '/vehicle-documents'
        })
    );

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
        status: 'success',
        data: {
            files: results.map(result => ({
                url: result.url,
                fileId: result.fileId,
                name: result.name
            }))
        }
    });
});

// Export multer upload middleware
exports.multerUpload = upload;