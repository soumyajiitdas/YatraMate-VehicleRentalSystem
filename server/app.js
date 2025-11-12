const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const authRouter = require('./routes/authRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const userRouter = require('./routes/userRoutes');
const vehicleRouter = require('./routes/vehicleRoutes');
const vendorRouter = require('./routes/vendorRoutes');
const packageRouter = require('./routes/packageRoutes');
const uploadRouter = require('./routes/uploadRoutes');
const vehicleRequestRouter = require('./routes/vehicleRequestRoutes');

const app = express();

app.set('trust proxy', 1);

app.use(cors({
    origin: "https://yatramate.vercel.app",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/vehicles', vehicleRouter);
app.use('/api/v1/vendors', vendorRouter);
app.use('/api/v1/packages', packageRouter);
app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/vehicle-requests', vehicleRequestRouter);

app.get('/', (req, res) => {
    res.status(200).send('YatraMate server is running successfully! 🎉');
});

app.use(globalErrorHandler);

module.exports = app;
