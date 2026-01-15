const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports (587 uses STARTTLS)
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

const sendEmail = async (options) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: process.env.EMAIL_FROM || 'YatraMate <noreply@yatramate.com>',
        to: options.email,
        subject: options.subject,
        text: options.text,
        html: options.html
    };

    await transporter.sendMail(mailOptions);
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

module.exports = {
    sendEmail,
    sendOTPEmail,
    sendPasswordResetEmail,
    sendPasswordChangeOTPEmail
};
