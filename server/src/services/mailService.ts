// src/services/mailService.ts
import nodemailer from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || '2525', 10),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = async (options: MailOptions) => {
  try {
    const info = await transporter.sendMail({
      // --- THIS IS THE CHANGE ---
      from: '"Mentorship Platform" <from@demomailtrap.com>', // Use a generic, accepted address
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
