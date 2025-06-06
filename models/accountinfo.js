const mongoose = require('mongoose');

const accountInfoSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  authProvider: String
});

module.exports = mongoose.model('AccountInfo', accountInfoSchema);
