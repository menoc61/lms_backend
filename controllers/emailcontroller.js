const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (data, res, req) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASS,
    },
  });
  const info = await transporter.sendMail({
    from: process.env.ENTERPRISE_NAME,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });
  console.log(`Message Send: ${info.messageId}`);
  console.log(`Preview Url: ${nodemailer.getTestMessageUrl(info)}`);
});

module.exports = sendEmail;
