const mongoose = require('mongoose');

const personalInfoSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  dateOfBirth: Date,
  gender: String,
  bio: String
});

module.exports = mongoose.model('PersonalInfo', personalInfoSchema);
