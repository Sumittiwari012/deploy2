const transporter = require('../config/nodemailer');

function sendmail(to, subject, msg) {
  transporter.sendMail({
    to,
    subject,
    html: msg,
  }, (error, info) => {
    if (error) return console.log('Email error:', error);
    console.log('Email sent:', info.response);
  });
}

function sendOtp(email) {
  const otp = Math.floor(Math.random() * 9000) + 1000;
  sendmail(email, 'Your OTP Code', `<p>Your OTP is <strong>${otp}</strong></p>`);
  return otp;
}

module.exports = { sendOtp };
