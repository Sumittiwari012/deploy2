const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
  name: String,
  username: String,
  edu: String,               
  exp: Number,       
  certification: [String],  // ✅ change to array
  lang: [String],           // ✅ change to array
  treat_app: [String],      // ✅ change to array
  mode: [String],           // ✅ change to array
  price: Number,            
  available: [String],      // ✅ change to array
  specialization: String,
  latitude: Number,
  longitude: Number            
});

module.exports = mongoose.model('Professional', professionalSchema);