const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  username: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  country: String,
  phoneVerified: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
