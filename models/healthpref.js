const mongoose = require('mongoose');

const healthPreferenceSchema = new mongoose.Schema({
  username: String,
  hasPreviousTherapy: Boolean,
  hasMentalHealthCondition: Boolean,
  conditionDetails: String,
  therapyType: [String],
  communicationMode: [String],
  goals: String,
  preferredLanguage: String
});

module.exports = mongoose.model('HealthPreference', healthPreferenceSchema);
