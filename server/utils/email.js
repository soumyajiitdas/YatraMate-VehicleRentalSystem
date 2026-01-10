const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'YatraMate <noreply@yatramate.com>',
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

const generateOTP = () => {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { sendEmail, generateOTP };
