const nodemailer = require('nodemailer');
require('dotenv').config(); // Load .env variables

// Create a transporter using Mailtrap SMTP
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "4e800accdef8ef",
    pass: "074dc04008a5bc"
  }
});

// Send email function
const sendTestEmail = async () => {
  try {
    let info = await transporter.sendMail({
      from: '"Your App Name" <no-reply@yourapp.com>',
      to: "opeterro007@gmail.com", // Replace with recipient email
      subject: "Hello from Mailtrap",
      text: "This is a test email!",
      html: "<b>This is a test email!</b>",
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Call the function for testing
sendTestEmail();
