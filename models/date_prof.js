const mongoose = require('mongoose');

const date_profSchema = new mongoose.Schema({
  username: String,      
  sun: [String],  // ✅ change to array
  mon: [String],           // ✅ change to array
  tue: [String],
  wed: [String],      // ✅ change to array
  thur: [String],           // ✅ change to array  
  fri: [String],      // ✅ change to array
  sat: [String]
});

module.exports = mongoose.model('Date_Prof', date_profSchema);