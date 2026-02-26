const nodemailer = require('nodemailer');

const AppError = require('./appError');

const createTransporter = () => {
    const port = parseInt(process.env.EMAIL_PORT, 10);
    const host = process.env.EMAIL_HOST;
    
    console.log(`Attempting to connect to email server: ${host}:${port}`);
    
    // For Gmail, using the built-in service config is more reliable in production
    if (host === 'smtp.gmail.com') {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            },
            connectionTimeout: 20000, // Increased to 20 seconds
            greetingTimeout: 20000,
            socketTimeout: 30000,
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    return nodemailer.createTransport({
        host: host,
        port: port,
        secure: port === 465, // true for 465, false for other ports (587 uses STARTTLS)
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        // Add timeouts to prevent hanging - increased for production stability
        connectionTimeout: 20000, // 20 seconds
        greetingTimeout: 20000,
        socketTimeout: 30000,
        requireTLS: port === 587,
        tls: {
            // Do not fail on invalid certs (common with some mail providers)
            rejectUnauthorized: false
        }
    });
};

const sendEmail = async (options) => {
    // If email server credentials are not configured, fall back in non-production
    const missingMailConfig = !process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD;

    if (missingMailConfig) {
        if (process.env.NODE_ENV !== 'production') {
            // Development fallback: log the email contents so registration can proceed without real SMTP
            console.log('--- Development email fallback ---');
            console.log('To:', options.email);
            console.log('Subject:', options.subject);
            console.log('Text:', options.text);
            console.log('HTML preview omitted');
            console.log('--- End fallback ---');
            return;
        }
        throw new AppError('Email service is not configured in production. Please set EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, and EMAIL_PASSWORD environment variables.', 500);
    }

    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'YatraMate <noreply@yatramate.com>',
            to: options.email,
            subject: options.subject,
            text: options.text,
            html: options.html
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${options.email}`);
    } catch (error) {
        console.error('Nodemailer Error:', error);
        
        if (error.code === 'ETIMEDOUT') {
            throw new AppError(`Connection to email server (${process.env.EMAIL_HOST}) timed out. Please check your EMAIL_PORT and host settings.`, 500);
        }
        
        if (error.code === 'ECONNREFUSED') {
            throw new AppError(`Connection refused by email server (${process.env.EMAIL_HOST}). Ensure the port is correct and not blocked.`, 500);
        }

        throw new AppError(`Failed to send email: ${error.message}`, 500);
    }
};

const sendOTPEmail = async (email, otp, name) => {
    const subject = 'Verify Your Email - YatraMate';
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 40px 0; text-align: center;">
                    <table role="presentation" style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%); border-radius: 16px 16px 0 0;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">YatraMate</h1>
                                <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Your Journey, Our Passion</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px;">
                                <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 22px; font-weight: 600;">Verify Your Email</h2>
                                <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
                                <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">Thank you for registering with YatraMate! Please use the following OTP to verify your email address:</p>
                                
                                <!-- OTP Box -->
                                <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 30px;">
                                    <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
                                    <p style="margin: 0; color: #1f2937; font-size: 36px; font-weight: 700; letter-spacing: 8px;">${otp}</p>
                                </div>
                                
                                <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; line-height: 1.6;">This OTP is valid for <strong>10 minutes</strong>.</p>
                                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">If you didn't create an account, please ignore this email.</p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 20px 40px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                <p style="margin: 0; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} YatraMate. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const text = `Hi ${name},\n\nThank you for registering with YatraMate!\n\nYour OTP code is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you didn't create an account, please ignore this email.\n\nBest regards,\nYatraMate Team`;

    await sendEmail({
        email,
        subject,
        text,
        html
    });
};

const sendPasswordResetEmail = async (email, resetURL, name) => {
    const subject = 'Reset Your Password - YatraMate';
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 40px 0; text-align: center;">
                    <table role="presentation" style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%); border-radius: 16px 16px 0 0;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">YatraMate</h1>
                                <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Your Journey, Our Passion</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px;">
                                <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 22px; font-weight: 600;">Reset Your Password</h2>
                                <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
                                <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">We received a request to reset your password. Click the button below to create a new password:</p>
                                
                                <!-- Reset Button -->
                                <div style="text-align: center; margin-bottom: 30px;">
                                    <a href="${resetURL}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);">Reset Password</a>
                                </div>
                                
                                <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; line-height: 1.6;">This link is valid for <strong>10 minutes</strong>.</p>
                                <p style="margin: 0 0 20px; color: #6b7280; font-size: 14px; line-height: 1.6;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                                
                                <!-- Alternative Link -->
                                <div style="background: #f3f4f6; border-radius: 8px; padding: 15px; margin-top: 20px;">
                                    <p style="margin: 0 0 10px; color: #6b7280; font-size: 12px;">If the button doesn't work, copy and paste this link into your browser:</p>
                                    <p style="margin: 0; color: #6366f1; font-size: 12px; word-break: break-all;">${resetURL}</p>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 20px 40px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                <p style="margin: 0; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} YatraMate. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const text = `Hi ${name},\n\nWe received a request to reset your password.\n\nPlease click the following link to reset your password:\n${resetURL}\n\nThis link is valid for 10 minutes.\n\nIf you didn't request a password reset, please ignore this email.\n\nBest regards,\nYatraMate Team`;

    await sendEmail({
        email,
        subject,
        text,
        html
    });
};

const sendPasswordChangeOTPEmail = async (email, otp, name) => {
    const subject = 'Password Change Verification - YatraMate';
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 40px 0; text-align: center;">
                    <table role="presentation" style="width: 100%; max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%); border-radius: 16px 16px 0 0;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">YatraMate</h1>
                                <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Your Journey, Our Passion</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px;">
                                <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 22px; font-weight: 600;">Password Change Request</h2>
                                <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
                                <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">You have requested to change your password. Please use the following OTP to verify this action:</p>
                                
                                <!-- OTP Box -->
                                <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 30px; border: 2px solid #f59e0b;">
                                    <p style="margin: 0 0 10px; color: #92400e; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                                    <p style="margin: 0; color: #78350f; font-size: 36px; font-weight: 700; letter-spacing: 8px;">${otp}</p>
                                </div>
                                
                                <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; line-height: 1.6;">This OTP is valid for <strong>10 minutes</strong>.</p>
                                <p style="margin: 0; color: #dc2626; font-size: 14px; line-height: 1.6; font-weight: 500;">⚠️ If you didn't request this password change, please ignore this email and ensure your account is secure.</p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 20px 40px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                <p style="margin: 0; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} YatraMate. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const text = `Hi ${name},\n\nYou have requested to change your password.\n\nYour verification code is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you didn't request this password change, please ignore this email and ensure your account is secure.\n\nBest regards,\nYatraMate Team`;

    await sendEmail({
        email,
        subject,
        text,
        html
    });
};

// Send email for vehicle pickup confirmation
const sendPickupConfirmationEmail = async (email, bookingData) => {
    const { 
        customerName, 
        billId, 
        vehicleName, 
        vehicleModel,
        vehicleBrand,
        vehicleType,
        registrationNumber,
        pickupLocation, 
        pickupDate, 
        pickupTime,
        odometerReading,
        packageName,
        pricePerKm,
        pricePerHour
    } = bookingData;

    const subject = `🚗 Vehicle Pickup Confirmed - ${billId} | YatraMate`;
    
    const formatDate = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 40px 0; text-align: center;">
                    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px 16px 0 0;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">YatraMate</h1>
                                <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Your Journey, Our Passion</p>
                            </td>
                        </tr>
                        
                        <!-- Success Banner -->
                        <tr>
                            <td style="padding: 30px 40px 20px; text-align: center;">
                                <div style="display: inline-block; background: #d1fae5; border-radius: 50%; padding: 15px; margin-bottom: 15px;">
                                    <span style="font-size: 40px;">✅</span>
                                </div>
                                <h2 style="margin: 0 0 10px; color: #059669; font-size: 24px; font-weight: 700;">Vehicle Pickup Confirmed!</h2>
                                <p style="margin: 0; color: #6b7280; font-size: 16px;">Your journey has begun. Drive safe!</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 20px 40px;">
                                <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">Hi <strong>${customerName}</strong>,</p>
                                <p style="margin: 0 0 25px; color: #4b5563; font-size: 16px; line-height: 1.6;">We're pleased to confirm that you have successfully picked up your vehicle. Below are the details of your booking:</p>
                                
                                <!-- Bill ID Box -->
                                <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px; border: 2px dashed #9ca3af;">
                                    <p style="margin: 0 0 5px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Bill ID</p>
                                    <p style="margin: 0; color: #1f2937; font-size: 24px; font-weight: 700; letter-spacing: 2px;">${billId}</p>
                                </div>
                                
                                <!-- Vehicle Details -->
                                <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                                    <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">🚗 Vehicle Details</h3>
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Vehicle</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${vehicleBrand} ${vehicleName} (${vehicleModel})</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Type</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; text-transform: capitalize;">${vehicleType}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Registration No.</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${registrationNumber}</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Pickup Details -->
                                <div style="background: #ecfdf5; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                                    <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #d1fae5; padding-bottom: 10px;">📍 Pickup Details</h3>
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Location</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${pickupLocation}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Date</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${formatDate(pickupDate)}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${pickupTime}</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Package Details -->
                                <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                                    <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #fde68a; padding-bottom: 10px;">💰 Pricing Details</h3>
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Package</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${packageName || 'Standard'}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Rate per KM</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">₹${pricePerKm}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Rate per Hour</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">₹${pricePerHour}</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Important Notes -->
                                <div style="background: #fef2f2; border-radius: 12px; padding: 20px; border-left: 4px solid #ef4444;">
                                    <h4 style="margin: 0 0 10px; color: #991b1b; font-size: 14px; font-weight: 600;">⚠️ Important Reminders</h4>
                                    <ul style="margin: 0; padding-left: 20px; color: #7f1d1d; font-size: 13px; line-height: 1.8;">
                                        <li><strong>ID Proof Collected:</strong> We have collected your original government ID proof for security purposes. You will receive it back when you return the vehicle.</li>
                                        <li>Return the vehicle to the same location</li>
                                        <li>Fuel charges are not included in the rental</li>
                                        <li>Report any issues immediately to our support team</li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb; background: #f9fafb; border-radius: 0 0 16px 16px;">
                                <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">Need help? Contact us at</p>
                                <p style="margin: 0 0 15px; color: #059669; font-size: 14px; font-weight: 600;">support@yatramate.com</p>
                                <p style="margin: 0; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} YatraMate. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const text = `Hi ${customerName},

Vehicle Pickup Confirmed!

Your journey has begun. Drive safe!

BILL ID: ${billId}

VEHICLE DETAILS:
- Vehicle: ${vehicleBrand} ${vehicleName} (${vehicleModel})
- Type: ${vehicleType}
- Registration No.: ${registrationNumber}

PICKUP DETAILS:
- Location: ${pickupLocation}
- Date: ${formatDate(pickupDate)}
- Time: ${pickupTime}
- Odometer Reading: ${odometerReading} km

PRICING:
- Package: ${packageName || 'Standard'}
- Rate per KM: ₹${pricePerKm}
- Rate per Hour: ₹${pricePerHour}

IMPORTANT REMINDERS:
- ID Proof Collected: We have collected your original government ID proof for security purposes. You will receive it back when you return the vehicle.
- Return the vehicle to the same location
- Fuel charges are not included in the rental
- Report any issues immediately to our support team

Need help? Contact us at support@yatramate.com

Best regards,
YatraMate Team`;

    await sendEmail({
        email,
        subject,
        text,
        html
    });
};

// Send email for successful vehicle return
const sendReturnConfirmationEmail = async (email, bookingData) => {
    const {
        customerName,
        billId,
        vehicleName,
        vehicleModel,
        vehicleBrand,
        vehicleType,
        registrationNumber,
        pickupLocation,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        odometerStart,
        odometerEnd,
        distanceTraveled,
        durationHours,
        costPerDistance,
        costPerTime,
        damageCost,
        finalCost,
        amountPaid,
        vehicleCondition
    } = bookingData;

    const subject = `🎉 Vehicle Returned Successfully - ${billId} | YatraMate`;
    
    const formatDate = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 40px 0; text-align: center;">
                    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px 16px 0 0;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">YatraMate</h1>
                                <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Your Journey, Our Passion</p>
                            </td>
                        </tr>
                        
                        <!-- Success Banner -->
                        <tr>
                            <td style="padding: 30px 40px 20px; text-align: center;">
                                <div style="display: inline-block; background: #ede9fe; border-radius: 50%; padding: 15px; margin-bottom: 15px;">
                                    <span style="font-size: 40px;">🎉</span>
                                </div>
                                <h2 style="margin: 0 0 10px; color: #6366f1; font-size: 24px; font-weight: 700;">Vehicle Returned Successfully!</h2>
                                <p style="margin: 0; color: #6b7280; font-size: 16px;">Thank you for choosing YatraMate!</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 20px 40px;">
                                <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">Hi <strong>${customerName}</strong>,</p>
                                <p style="margin: 0 0 25px; color: #4b5563; font-size: 16px; line-height: 1.6;">Your vehicle has been successfully returned. Here's a complete summary of your trip:</p>
                                
                                <!-- Bill ID Box -->
                                <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px; border: 2px dashed #9ca3af;">
                                    <p style="margin: 0 0 5px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Bill ID</p>
                                    <p style="margin: 0; color: #1f2937; font-size: 24px; font-weight: 700; letter-spacing: 2px;">${billId}</p>
                                </div>
                                
                                <!-- Vehicle Details -->
                                <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                                    <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">🚗 Vehicle Details</h3>
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Vehicle</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${vehicleBrand} ${vehicleName} (${vehicleModel})</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Type</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; text-transform: capitalize;">${vehicleType}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Registration No.</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${registrationNumber}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Condition at Return</td>
                                            <td style="padding: 8px 0; color: ${vehicleCondition === 'perfect' ? '#10b981' : '#ef4444'}; font-size: 14px; font-weight: 600; text-align: right; text-transform: capitalize;">${vehicleCondition === 'perfect' ? '✅ Perfect' : '⚠️ Damaged'}</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Trip Summary -->
                                <div style="background: #ecfdf5; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                                    <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #d1fae5; padding-bottom: 10px;">📊 Trip Summary</h3>
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Pickup Location</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${pickupLocation}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Pickup Date & Time</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${formatDate(pickupDate)} at ${pickupTime}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Return Date & Time</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${formatDate(returnDate)} at ${returnTime}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Odometer (Start → End)</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${odometerStart} km → ${odometerEnd} km</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Total Distance</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${distanceTraveled} km</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Total Duration</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${durationHours} hours</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Cost Breakdown -->
                                <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                                    <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #fde68a; padding-bottom: 10px;">💰 Cost Breakdown</h3>
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Distance Charges (${distanceTraveled} km)</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${formatCurrency(costPerDistance)}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time Charges (${durationHours} hours)</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${formatCurrency(costPerTime)}</td>
                                        </tr>
                                        ${damageCost > 0 ? `
                                        <tr>
                                            <td style="padding: 8px 0; color: #ef4444; font-size: 14px;">Damage Charges</td>
                                            <td style="padding: 8px 0; color: #ef4444; font-size: 14px; font-weight: 600; text-align: right;">${formatCurrency(damageCost)}</td>
                                        </tr>
                                        ` : ''}
                                        <tr style="border-top: 2px solid #fde68a;">
                                            <td style="padding: 12px 0; color: #1f2937; font-size: 16px; font-weight: 700;">Total Amount</td>
                                            <td style="padding: 12px 0; color: #1f2937; font-size: 18px; font-weight: 700; text-align: right;">${formatCurrency(finalCost)}</td>
                                        </tr>
                                        <tr style="background: #d1fae5; border-radius: 8px;">
                                            <td style="padding: 12px 8px; color: #059669; font-size: 14px; font-weight: 600;">Amount Paid</td>
                                            <td style="padding: 12px 8px; color: #059669; font-size: 16px; font-weight: 700; text-align: right;">${formatCurrency(amountPaid)}</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Thank You Message -->
                                <div style="background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); border-radius: 12px; padding: 25px; text-align: center;">
                                    <p style="margin: 0 0 10px; color: #6366f1; font-size: 18px; font-weight: 600;">Thank you for riding with us! 🙏</p>
                                    <p style="margin: 0; color: #6b7280; font-size: 14px;">We hope you had a wonderful journey. See you again soon!</p>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb; background: #f9fafb; border-radius: 0 0 16px 16px;">
                                <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">Need help? Contact us at</p>
                                <p style="margin: 0 0 15px; color: #6366f1; font-size: 14px; font-weight: 600;">support@yatramate.com</p>
                                <p style="margin: 0; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} YatraMate. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const text = `Hi ${customerName},

Vehicle Returned Successfully! 🎉

Thank you for choosing YatraMate!

BILL ID: ${billId}

VEHICLE DETAILS:
- Vehicle: ${vehicleBrand} ${vehicleName} (${vehicleModel})
- Type: ${vehicleType}
- Registration No.: ${registrationNumber}
- Condition at Return: ${vehicleCondition === 'perfect' ? 'Perfect' : 'Damaged'}

TRIP SUMMARY:
- Pickup Location: ${pickupLocation}
- Pickup: ${formatDate(pickupDate)} at ${pickupTime}
- Return: ${formatDate(returnDate)} at ${returnTime}
- Odometer: ${odometerStart} km → ${odometerEnd} km
- Total Distance: ${distanceTraveled} km
- Total Duration: ${durationHours} hours

COST BREAKDOWN:
- Distance Charges (${distanceTraveled} km): ${formatCurrency(costPerDistance)}
- Time Charges (${durationHours} hours): ${formatCurrency(costPerTime)}
${damageCost > 0 ? `- Damage Charges: ${formatCurrency(damageCost)}` : ''}
- Total Amount: ${formatCurrency(finalCost)}
- Amount Paid: ${formatCurrency(amountPaid)}

Thank you for riding with us! We hope you had a wonderful journey.

Need help? Contact us at support@yatramate.com

Best regards,
YatraMate Team`;

    await sendEmail({
        email,
        subject,
        text,
        html
    });
};

// Send email for vendor verification
const sendVendorVerificationEmail = async (email, vendorData) => {
    const { vendorName, businessName } = vendorData;

    const subject = `🎉 Vendor Account Verified - Welcome to YatraMate!`;
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 40px 0; text-align: center;">
                    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px 16px 0 0;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">YatraMate</h1>
                                <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Your Journey, Our Passion</p>
                            </td>
                        </tr>
                        
                        <!-- Success Banner -->
                        <tr>
                            <td style="padding: 30px 40px 20px; text-align: center;">
                                <div style="display: inline-block; background: #d1fae5; border-radius: 50%; padding: 15px; margin-bottom: 15px;">
                                    <span style="font-size: 40px;">🎉</span>
                                </div>
                                <h2 style="margin: 0 0 10px; color: #059669; font-size: 24px; font-weight: 700;">Your Vendor Account is Verified!</h2>
                                <p style="margin: 0; color: #6b7280; font-size: 16px;">You can now login and start adding vehicles</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 20px 40px;">
                                <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">Hi <strong>${vendorName}</strong>,</p>
                                <p style="margin: 0 0 25px; color: #4b5563; font-size: 16px; line-height: 1.6;">Congratulations! Your vendor account for <strong>${businessName || 'your business'}</strong> has been successfully verified by our admin team.</p>
                                
                                <!-- Welcome Box -->
                                <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 2px solid #10b981;">
                                    <h3 style="margin: 0 0 15px; color: #059669; font-size: 18px; font-weight: 600; text-align: center;">🚀 What's Next?</h3>
                                    <ul style="margin: 0; padding-left: 20px; color: #065f46; font-size: 14px; line-height: 1.8;">
                                        <li><strong>Login to your account</strong> using your registered email and password</li>
                                        <li><strong>Add your vehicles</strong> to the platform with complete details</li>
                                        <li><strong>Manage bookings</strong> and track your earnings</li>
                                        <li><strong>Grow your business</strong> with YatraMate's customer base</li>
                                    </ul>
                                </div>
                                
                                <!-- Account Details -->
                                <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                                    <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📋 Account Details</h3>
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Vendor Name</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${vendorName}</td>
                                        </tr>
                                        ${businessName ? `
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Business Name</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${businessName}</td>
                                        </tr>
                                        ` : ''}
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${email}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Account Status</td>
                                            <td style="padding: 8px 0; color: #10b981; font-size: 14px; font-weight: 600; text-align: right;">✅ Verified</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Important Notes -->
                                <div style="background: #fffbeb; border-radius: 12px; padding: 20px; border-left: 4px solid #f59e0b;">
                                    <h4 style="margin: 0 0 10px; color: #92400e; font-size: 14px; font-weight: 600;">💡 Important Guidelines</h4>
                                    <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 13px; line-height: 1.8;">
                                        <li>Ensure all vehicle documents are valid and up-to-date</li>
                                        <li>Provide accurate vehicle information and high-quality images</li>
                                        <li>Maintain your vehicles in excellent condition</li>
                                        <li>Respond promptly to booking requests</li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb; background: #f9fafb; border-radius: 0 0 16px 16px;">
                                <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">Need help? Contact us at</p>
                                <p style="margin: 0 0 15px; color: #059669; font-size: 14px; font-weight: 600;">support@yatramate.com</p>
                                <p style="margin: 0; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} YatraMate. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const text = `Hi ${vendorName},

Congratulations! Your vendor account for ${businessName || 'your business'} has been successfully verified by our admin team.

ACCOUNT STATUS: ✅ Verified

WHAT'S NEXT?
- Login to your account using your registered email and password
- Add your vehicles to the platform with complete details
- Manage bookings and track your earnings
- Grow your business with YatraMate's customer base

ACCOUNT DETAILS:
- Vendor Name: ${vendorName}
${businessName ? `- Business Name: ${businessName}` : ''}
- Email: ${email}
- Account Status: Verified

IMPORTANT GUIDELINES:
- Ensure all vehicle documents are valid and up-to-date
- Provide accurate vehicle information and high-quality images
- Maintain your vehicles in excellent condition
- Respond promptly to booking requests

Need help? Contact us at support@yatramate.com

Best regards,
YatraMate Team`;

    await sendEmail({
        email,
        subject,
        text,
        html
    });
};

// Send email for vehicle approval
const sendVehicleApprovalEmail = async (email, vehicleData) => {
    const { vendorName, vehicleName, vehicleBrand, vehicleModel, registrationNumber, vehicleType } = vehicleData;

    const subject = `✅ Vehicle Approved - ${vehicleBrand} ${vehicleName} | YatraMate`;
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 40px 0; text-align: center;">
                    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px 16px 0 0;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">YatraMate</h1>
                                <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Your Journey, Our Passion</p>
                            </td>
                        </tr>
                        
                        <!-- Success Banner -->
                        <tr>
                            <td style="padding: 30px 40px 20px; text-align: center;">
                                <div style="display: inline-block; background: #ddd6fe; border-radius: 50%; padding: 15px; margin-bottom: 15px;">
                                    <span style="font-size: 40px;">✅</span>
                                </div>
                                <h2 style="margin: 0 0 10px; color: #6366f1; font-size: 24px; font-weight: 700;">Vehicle Approved Successfully!</h2>
                                <p style="margin: 0; color: #6b7280; font-size: 16px;">Your vehicle is now listed on YatraMate</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 20px 40px;">
                                <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">Hi <strong>${vendorName}</strong>,</p>
                                <p style="margin: 0 0 25px; color: #4b5563; font-size: 16px; line-height: 1.6;">Great news! Your vehicle has been reviewed and approved by our admin team. It is now live on the YatraMate platform and available for customers to book.</p>
                                
                                <!-- Vehicle Details -->
                                <div style="background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 2px solid #6366f1;">
                                    <h3 style="margin: 0 0 15px; color: #4c1d95; font-size: 18px; font-weight: 600; text-align: center;">🚗 Approved Vehicle Details</h3>
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #5b21b6; font-size: 14px;">Vehicle</td>
                                            <td style="padding: 8px 0; color: #4c1d95; font-size: 14px; font-weight: 600; text-align: right;">${vehicleBrand} ${vehicleName}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #5b21b6; font-size: 14px;">Model</td>
                                            <td style="padding: 8px 0; color: #4c1d95; font-size: 14px; font-weight: 600; text-align: right;">${vehicleModel}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #5b21b6; font-size: 14px;">Type</td>
                                            <td style="padding: 8px 0; color: #4c1d95; font-size: 14px; font-weight: 600; text-align: right; text-transform: capitalize;">${vehicleType}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #5b21b6; font-size: 14px;">Registration No.</td>
                                            <td style="padding: 8px 0; color: #4c1d95; font-size: 14px; font-weight: 600; text-align: right;">${registrationNumber}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #5b21b6; font-size: 14px;">Status</td>
                                            <td style="padding: 8px 0; color: #10b981; font-size: 14px; font-weight: 600; text-align: right;">✅ Approved & Listed</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- What's Next -->
                                <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                                    <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📊 What Happens Now?</h3>
                                    <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
                                        <li>Your vehicle is now <strong>visible to all customers</strong> on the platform</li>
                                        <li>Customers can search, view, and book your vehicle</li>
                                        <li>You will receive notifications for new booking requests</li>
                                        <li>Track your bookings and earnings from the vendor dashboard</li>
                                    </ul>
                                </div>
                                
                                <!-- Tips for Success -->
                                <div style="background: #ecfdf5; border-radius: 12px; padding: 20px; border-left: 4px solid #10b981;">
                                    <h4 style="margin: 0 0 10px; color: #065f46; font-size: 14px; font-weight: 600;">💡 Tips for Success</h4>
                                    <ul style="margin: 0; padding-left: 20px; color: #047857; font-size: 13px; line-height: 1.8;">
                                        <li>Keep your vehicle clean and well-maintained</li>
                                        <li>Ensure timely availability for confirmed bookings</li>
                                        <li>Respond quickly to customer inquiries</li>
                                        <li>Update vehicle status if it becomes unavailable</li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb; background: #f9fafb; border-radius: 0 0 16px 16px;">
                                <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">Need help? Contact us at</p>
                                <p style="margin: 0 0 15px; color: #6366f1; font-size: 14px; font-weight: 600;">support@yatramate.com</p>
                                <p style="margin: 0; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} YatraMate. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const text = `Hi ${vendorName},

Great news! Your vehicle has been reviewed and approved by our admin team. It is now live on the YatraMate platform and available for customers to book.

APPROVED VEHICLE DETAILS:
- Vehicle: ${vehicleBrand} ${vehicleName}
- Model: ${vehicleModel}
- Type: ${vehicleType}
- Registration No.: ${registrationNumber}
- Status: ✅ Approved & Listed

WHAT HAPPENS NOW?
- Your vehicle is now visible to all customers on the platform
- Customers can search, view, and book your vehicle
- You will receive notifications for new booking requests
- Track your bookings and earnings from the vendor dashboard

TIPS FOR SUCCESS:
- Keep your vehicle clean and well-maintained
- Ensure timely availability for confirmed bookings
- Respond quickly to customer inquiries
- Update vehicle status if it becomes unavailable

Need help? Contact us at support@yatramate.com

Best regards,
YatraMate Team`;

    await sendEmail({
        email,
        subject,
        text,
        html
    });
};

// Send cancellation email
const sendCancellationEmail = async (email, bookingData) => {
    const {
        customerName,
        billId,
        vehicleName,
        vehicleModel,
        vehicleBrand,
        vehicleType,
        registrationNumber,
        pickupDate,
        pickupTime,
        cancellationReason,
        cancelledBy,
        refundAmount,
        refundStatus
    } = bookingData;

    const subject = `🚫 Booking Cancelled - ${billId !== 'N/A' ? billId : 'Booking Request'} | YatraMate`;
    
    const formatDate = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 40px 0; text-align: center;">
                    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 16px 16px 0 0;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">YatraMate</h1>
                                <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Your Journey, Our Passion</p>
                            </td>
                        </tr>
                        
                        <!-- Cancellation Banner -->
                        <tr>
                            <td style="padding: 30px 40px 20px; text-align: center;">
                                <div style="display: inline-block; background: #fee2e2; border-radius: 50%; padding: 15px; margin-bottom: 15px;">
                                    <span style="font-size: 40px;">🚫</span>
                                </div>
                                <h2 style="margin: 0 0 10px; color: #dc2626; font-size: 24px; font-weight: 700;">Booking Cancelled</h2>
                                <p style="margin: 0; color: #6b7280; font-size: 16px;">${cancelledBy === 'You' ? 'Your booking has been cancelled as per your request' : 'Your pickup request was rejected'}</p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 20px 40px;">
                                <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">Hi <strong>${customerName}</strong>,</p>
                                <p style="margin: 0 0 25px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                    ${cancelledBy === 'You' 
                                        ? 'We have successfully cancelled your booking as requested.' 
                                        : 'We regret to inform you that your pickup request has been rejected by our staff.'}
                                </p>
                                
                                ${billId !== 'N/A' ? `
                                <!-- Bill ID Box -->
                                <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px; border: 2px dashed #9ca3af;">
                                    <p style="margin: 0 0 5px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Bill ID</p>
                                    <p style="margin: 0; color: #1f2937; font-size: 24px; font-weight: 700; letter-spacing: 2px;">${billId}</p>
                                </div>
                                ` : ''}
                                
                                <!-- Vehicle Details -->
                                <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                                    <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">🚗 Vehicle Details</h3>
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Vehicle</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${vehicleBrand} ${vehicleName} (${vehicleModel})</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Type</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; text-transform: capitalize;">${vehicleType}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Registration No.</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${registrationNumber}</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Booking Details -->
                                <div style="background: #fef2f2; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                                    <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 16px; font-weight: 600; border-bottom: 2px solid #fecaca; padding-bottom: 10px;">📅 Booking Details</h3>
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Pickup Date</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${formatDate(pickupDate)}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Pickup Time</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${pickupTime}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Status</td>
                                            <td style="padding: 8px 0; color: #dc2626; font-size: 14px; font-weight: 600; text-align: right;">❌ Cancelled</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Cancellation Reason -->
                                <div style="background: #fffbeb; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
                                    <h4 style="margin: 0 0 10px; color: #92400e; font-size: 14px; font-weight: 600;">📝 ${cancelledBy === 'You' ? 'Cancellation Reason' : 'Rejection Reason'}</h4>
                                    <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6;">${cancellationReason}</p>
                                </div>
                                
                                ${refundAmount > 0 ? `
                                <!-- Refund Information -->
                                <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 2px solid #10b981;">
                                    <h3 style="margin: 0 0 15px; color: #065f46; font-size: 18px; font-weight: 600; text-align: center;">💰 Refund Information</h3>
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #047857; font-size: 14px;">Refund Amount</td>
                                            <td style="padding: 8px 0; color: #065f46; font-size: 16px; font-weight: 700; text-align: right;">${formatCurrency(refundAmount)}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #047857; font-size: 14px;">Refund Status</td>
                                            <td style="padding: 8px 0; color: #065f46; font-size: 14px; font-weight: 600; text-align: right; text-transform: capitalize;">${refundStatus === 'pending' ? '⏳ Pending' : refundStatus === 'completed' ? '✅ Completed' : refundStatus}</td>
                                        </tr>
                                    </table>
                                    <div style="margin-top: 15px; padding: 12px; background: rgba(255, 255, 255, 0.7); border-radius: 8px;">
                                        <p style="margin: 0; color: #047857; font-size: 13px; line-height: 1.6; text-align: center;">
                                            <strong>Note:</strong> Your refund will be processed within <strong>7 working days</strong> and credited to your original payment method.
                                        </p>
                                    </div>
                                </div>
                                ` : ''}
                                
                                <!-- Next Steps -->
                                <div style="background: #f3f4f6; border-radius: 12px; padding: 20px;">
                                    <h4 style="margin: 0 0 10px; color: #1f2937; font-size: 14px; font-weight: 600;">What's Next?</h4>
                                    <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 13px; line-height: 1.8;">
                                        ${refundAmount > 0 ? '<li>Your refund will be processed and credited within 7 working days</li>' : ''}
                                        <li>You can browse and book other available vehicles on our platform</li>
                                        <li>Contact our support team if you have any questions</li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb; background: #f9fafb; border-radius: 0 0 16px 16px;">
                                <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">Need help? Contact us at</p>
                                <p style="margin: 0 0 15px; color: #dc2626; font-size: 14px; font-weight: 600;">support@yatramate.com</p>
                                <p style="margin: 0; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} YatraMate. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    const text = `Hi ${customerName},

Booking Cancelled

${cancelledBy === 'You' ? 'Your booking has been cancelled as per your request.' : 'Your pickup request was rejected by our staff.'}

${billId !== 'N/A' ? `BILL ID: ${billId}\n` : ''}
VEHICLE DETAILS:
- Vehicle: ${vehicleBrand} ${vehicleName} (${vehicleModel})
- Type: ${vehicleType}
- Registration No.: ${registrationNumber}

BOOKING DETAILS:
- Pickup Date: ${formatDate(pickupDate)}
- Pickup Time: ${pickupTime}
- Status: Cancelled

${cancelledBy === 'You' ? 'CANCELLATION REASON:' : 'REJECTION REASON:'}
${cancellationReason}

${refundAmount > 0 ? `REFUND INFORMATION:
- Refund Amount: ${formatCurrency(refundAmount)}
- Refund Status: ${refundStatus}

Note: Your refund will be processed within 7 working days and credited to your original payment method.
` : ''}

WHAT'S NEXT?
${refundAmount > 0 ? '- Your refund will be processed and credited within 7 working days\n' : ''}- You can browse and book other available vehicles on our platform
- Contact our support team if you have any questions

Need help? Contact us at support@yatramate.com

Best regards,
YatraMate Team`;

    await sendEmail({
        email,
        subject,
        text,
        html
    });
};

module.exports = {
    sendEmail,
    sendOTPEmail,
    sendPasswordResetEmail,
    sendPasswordChangeOTPEmail,
    sendPickupConfirmationEmail,
    sendReturnConfirmationEmail,
    sendCancellationEmail,
    sendVendorVerificationEmail,
    sendVehicleApprovalEmail
};
