const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "bookstore178@gmail.com",
    pass: process.env.pass_key,
  },
});

module.exports = transporter;