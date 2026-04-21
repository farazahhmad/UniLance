const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a Transporter (The "Mailman")
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 2. Define Email Options
    const mailOptions = {
        from: `UniLance Admin <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // Optional: Use 'html' instead of 'text' for styled emails
        html: options.html 
    };

    // 3. Send the Email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;