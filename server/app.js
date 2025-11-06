const express = require('express');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const bookingRouter = require('./routes/bookingRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const userRouter = require('./routes/userRoutes');
const vehicleRouter = require('./routes/vehicleRoutes');
const vendorRouter = require('./routes/vendorRoutes');

const app = express();

app.use(express.json());

app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/vehicles', vehicleRouter);
app.use('/api/v1/vendors', vendorRouter);

app.get('/', (req, res) => {
    res.status(200).send('YatraMate server is running successfully! 🎉');
});

app.use(globalErrorHandler);

module.exports = app;
