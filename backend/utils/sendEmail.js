import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const sendEmail = async ({ email, subject, message }) => {
  // Create a transporter using environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_MAIL, // The email account sending the message
      pass: process.env.SMTP_PASSWORD, // The password for the email account
    },
  });

  // Email options
  const options = {
    from: process.env.SMTP_MAIL, // Sender's email (from environment variables)
    to: email, // Recipient's email
    subject, // Subject passed in the argument
    text: message, // Message passed in the argument
  };

  // Send the email
  try {
    await transporter.sendMail(options);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
