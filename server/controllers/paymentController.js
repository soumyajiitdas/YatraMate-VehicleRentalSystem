const Payment = require('../models/Payment');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllPayments = catchAsync(async (req, res, next) => {
    const payments = await Payment.find();

    res.status(200).json({
        status: 'success',
        results: payments.length,
        data: {
            payments
        }
    });
});

exports.getPayment = catchAsync(async (req, res, next) => {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
        return next(new AppError('No payment found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            payment
        }
    });
});

exports.createPayment = catchAsync(async (req, res, next) => {
    const newPayment = await Payment.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            payment: newPayment
        }
    });
});

exports.updatePayment = catchAsync(async (req, res, next) => {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!payment) {
        return next(new AppError('No payment found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            payment
        }
    });
});

exports.deletePayment = catchAsync(async (req, res, next) => {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
        return next(new AppError('No payment found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
