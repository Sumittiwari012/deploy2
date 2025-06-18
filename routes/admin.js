const express = require('express');
const router = express.Router();
const professional = require('../models/professional');

// Admin Control Panel
router.get('/admin_control', async (req, res) => {
  const approved = await professional.find({ approve: true });
  const unapproved = await professional.find({ approve: false });
  res.render('admin/admin_control', { approved, unapproved });
});

// Approve a Professional
router.post('/admin/:id', async (req, res) => {
  await professional.findByIdAndUpdate(req.params.id, { approve: true });
  res.redirect('/admin_control');
});

module.exports = router;
