import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT), 
    secure: false, 
    auth: {
        user: process.env.SMTP_USER, // Your email address
        pass: process.env.SMTP_PASS, // Your email password or app-specific password
    },
});

export const sendNotification = async (recipientEmail: string, subject: string, content: string) => {
    const mailOptions = {
        from: process.env.SMTP_USER, // sender address
        to: recipientEmail, // list of receivers
        subject: subject, // Subject line
        text: content, // plain text body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to ${recipientEmail}`);
    } catch (error) {
        console.error(`Failed to send notification to ${recipientEmail}:`, error);
        throw new Error('Error sending email notification');
    }
};
