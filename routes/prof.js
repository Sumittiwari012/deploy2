require('dotenv').config();
const express = require('express');
const router = express.Router();
const booking = require('../models/booking');
const Person = require('../models/personal');
const prof = require('../models/professional');
const dp = require('../models/date_prof');

router.get('/p_dashboard', async (req, res) => {
  if (!req.session.user) return res.redirect('/login_prof');

  const { username } = req.session.user;
  const professional = await prof.findOne({ username });

  const isProfileComplete = Boolean(
  professional?.name &&
  professional?.edu &&
  typeof professional?.exp === 'number' &&
  Array.isArray(professional?.certification) && professional.certification.length > 0 &&
  Array.isArray(professional?.lang) && professional.lang.length > 0 &&
  Array.isArray(professional?.treat_app) && professional.treat_app.length > 0 &&
  Array.isArray(professional?.mode) && professional.mode.length > 0 &&
  typeof professional?.price === 'number' &&
  professional?.specialization &&
  professional?.pno &&
  professional?.email
);
    console.log(isProfileComplete);
  res.render('prof_dashboard/p_dashboard', {
    username,
    isProfileComplete,
    professional
  });
});

router.get('/login_prof', async (req, res) => {
  res.render('prof_dashboard/login_prof');
});

router.get('/profile_comp', async (req, res) => {
  if (!req.session.user) return res.redirect('/login_prof');
  res.render('prof_dashboard/profile_comp');
});

router.get('/update', async (req, res) => {
  if (!req.session.user) return res.redirect('/login_prof');
  res.render('prof_dashboard/update');
});

router.post('/update', async (req, res) => {
  if (!req.session.user) return res.redirect('/login_prof');

  try {
    
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/saveProfile', async (req, res) => {
  if (!req.session.user) return res.redirect('/login_prof');

  try {
    const {
      name, pno, password, edu, exp, price,
      certification, specialization, lang,
      mode, address, treat_app, available,
      time_slots
    } = req.body;

    const requiresAddress = Array.isArray(mode)
      ? mode.includes('In-Person') || mode.includes('Hybrid')
      : mode === 'In-Person' || mode === 'Hybrid';

    if (requiresAddress && (!address || address.trim() === '')) {
      return res.status(400).json({ error: 'Address required for In-Person or Hybrid mode.' });
    }

    // 1. Update profile data
    const updateData = {
      name,
      pno,
      password,
      edu,
      exp,
      price,
      specialization,
      certification: [].concat(certification || []),
      lang: [].concat(lang || []),
      mode: [].concat(mode || []),
      address: requiresAddress ? address : '',
      treat_app: [].concat(treat_app || []),
      approve: false
    };

    const updatedProfile = await prof.findOneAndUpdate(
      { username: req.session.user.username },
      updateData,
      { new: true, upsert: false }
    );

    // 2. Update Date_Prof model
    const dayMap = {
      'Sunday': 'sun',
      'Monday': 'mon',
      'Tuesday': 'tue',
      'Wednesday': 'wed',
      'Thursday': 'thur',
      'Friday': 'fri',
      'Saturday': 'sat'
    };

    const slotMap = {};
    for (const day of available || []) {
      const abbr = dayMap[day];
      if (abbr) slotMap[abbr] = [].concat(time_slots || []);
    }

    await dp.findOneAndUpdate(
      { username: req.session.user.username },
      { username: req.session.user.username, ...slotMap },
      { upsert: true, new: true }
    );

    console.log('Profile updated + Time slots saved:', slotMap);
    return res.redirect('/p_dashboard');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
