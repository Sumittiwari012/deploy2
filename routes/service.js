
const express = require('express');
const router = express.Router();
const session = require('express-session');
const professional = require('../models/professional');
const booking=require('../models/booking');
const personal = require("../models/personal");
const date_prof = require('../models/date_prof');
router.get('/therapy', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  try {
    res.render('therapy');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post('/api/filter-therapists', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const { date, specialization, language, mode } = req.body;
    const query = {};

    let weekdayKey = null;
    if (date && date !== 'ALL') {
      weekdayKey = new Date(date).toLocaleDateString("en-US", {
        weekday: "short"
      }).toLowerCase().slice(0, 3); // e.g., "mon", "tue"
    }

    // 🔁 Fix for mismatch between JS weekday and DB field name
    const weekdayMap = {
      mon: "mon",
      tue: "tue",
      wed: "wed",
      thu: "thur", // JS "thu" → DB "thur"
      fri: "fri",
      sat: "sat",
      sun: "sun"
    };

    const actualKey = weekdayMap[weekdayKey];

    if (specialization?.trim().toUpperCase() !== 'ALL') {
      query.specialization = { $regex: new RegExp(`^${specialization.trim()}$`, 'i') };
    }

    if (language?.trim().toUpperCase() !== 'ALL') {
      query.lang = { $elemMatch: { $regex: new RegExp(`^${language.trim()}$`, 'i') } };
    }

    if (mode?.trim().toUpperCase() !== 'ALL') {
      query.mode = { $elemMatch: { $regex: new RegExp(`^${mode.trim()}$`, 'i') } };
    }

    const therapists = await professional.find(query).lean();
    const therapistUsernames = therapists.map(t => t.username);

    // Get available time slots from Date_Prof for matched therapists
    const timeData = await date_prof.find({
      username: { $in: therapistUsernames }
    }).lean();

    const timeMap = {};
    for (const doc of timeData) {
      timeMap[doc.username] = actualKey ? (doc[actualKey] || []) : [];
    }

    const enrichedTherapists = therapists.map(t => ({
      ...t,
      available: weekdayKey ? [weekdayKey] : [],
      timeSlots: timeMap[t.username] || []
    }));

    res.json({ success: true, matchedTherapists: enrichedTherapists });

  } catch (error) {
    console.error("❌ Error in /api/filter-therapists:", error);
    res.status(500).send("Server Error");
  }
});


router.post("/api/book-session", async (req, res) => {
  try {
    // ✅ Check session first
    if (!req.session.user) return res.redirect('/login');

    // ✅ Get client details
    const client = await personal.findOne({ username: req.session.user.username });
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });

    const {
      therapistUsername,
      date,
      time,
      consultationType,
      mode
    } = req.body;

    // ✅ Fetch therapist details
    const therapist = await professional.findOne({ username: therapistUsername });
    if (!therapist) return res.status(404).json({ success: false, message: "Therapist not found" });

    // ✅ Check for booking clash (therapist or client at same date & time)
    const existingBooking = await booking.findOne({
      date: new Date(date),
      time: time,
      $or: [
        { prof_username: therapistUsername },
        { client_username: req.session.user.username }
      ]
    });

    if (existingBooking) {
      return res.status(409).json({ success: false, message: "Booking conflict: The selected time slot is already taken." });
    }

    // ✅ Create booking
    const newBooking = new booking({
      prof_name: therapist.name,
      prof_username: therapist.username,
      client_name: client.fullName,
      client_username: req.session.user.username,
      mode,
      date: new Date(date),  // ensure it's Date type
      time,
      consult_type: consultationType
    });

    await newBooking.save();

    return res.json({ success: true, message: "Booking confirmed" });

  } catch (err) {
    console.error("Booking error:", err);
    return res.status(500).json({ success: false, message: "Booking failed" });
  }
});




module.exports = router;
