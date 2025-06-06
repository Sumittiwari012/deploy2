require('dotenv').config();
const express = require('express');
const router = express.Router();
const PersonalInfo = require('../models/personal');
const HealthPreference = require('../models/healthpref');
const ContactInfo = require('../models/contactinfo'); // use correct models
const AccountInfo = require('../models/accountinfo'); // use correct models

const app = express();
app.use(express.json());


router.get('/edit', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  try {
    
    const username = req.session.user.username;
    
    const personal = await PersonalInfo.findOne({ username });
    const contact = await ContactInfo.findOne({ username });
    const health = await HealthPreference.findOne({ username });
    // Construct a combined user object for the form
    const user = {
      fullName: personal?.fullName || '',
      dob: personal?.dateOfBirth ? personal.dateOfBirth.toISOString().split('T')[0] : '',
      gender: personal?.gender || '',
      bio: personal?.bio || '',
      phone: contact?.phone || '',
      address: contact?.address || '',
      country: contact?.country || '',
      healthPreferences: health?.conditionDetails ? health.conditionDetails.split(', ') : [],
      preferredSupport: health?.therapyType || []
    };
    //console.log(user);
    res.render('edit', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get('/userpage', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const username = req.session.user.username;
  
  try {
    const personal = await PersonalInfo.findOne({ username }).lean();
    const contact = await ContactInfo.findOne({ username }).lean();
    const account = await AccountInfo.findOne({ username }).lean();
   
    const allDocs = {
      Personal: personal || {},
      Contact: contact || {},
      Account: account || {}
    };

    const missingFields = {
      Personal: [],
      Contact: [],
      Account: []
    };
  res.render('userpage', {
    user: {
      fullName: personal.fullName,
      username: personal.username,
      hasPassword: !!account.password, // true if password exists
      emailVerified: contact.emailVerified
    }
  });
  } catch (err) {
    console.error('Userpage Error:', err);
    res.status(500).send('Server error.');
  }
});
app.post('/complete-single-field', async (req, res) => {
  // validate and update user's field
  res.json({ success: true, verifiedPercentage: 80 });
});

router.post('/edit', async (req, res) => {
  try {
    const username = req.session.user?.username;
    if (!username) return res.status(401).send('Unauthorized');

    const {
      fullName,
      dob,
      gender,
      phone,
      address,
      country,
      bio,
      healthPreferences = [],
      preferredSupport = []
    } = req.body;
    
    // Normalize to array if single string is submitted
    const healthPrefs = Array.isArray(healthPreferences) ? healthPreferences : [healthPreferences];
    const supportPrefs = Array.isArray(preferredSupport) ? preferredSupport : [preferredSupport];

    // Update Personal Info
    await PersonalInfo.findOneAndUpdate(
      { username },
      {
        fullName,
        dateOfBirth: dob,
        gender,
        bio
      },
      { upsert: true }
    );

    // Update Contact Info
    await ContactInfo.findOneAndUpdate(
      { username },
      {
        phone,
        address,
        country
      },
      { upsert: true }
    );

    // Update Health Preferences
    await HealthPreference.findOneAndUpdate(
      { username },
      {
        conditionDetails: healthPrefs.join(', '),
        therapyType: supportPrefs
      },
      { upsert: true }
    );

    res.redirect('/userpage');
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
