const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Event = require('../models/Event');

// Get all users (admin only)
router.get('/users', auth('admin'), async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
});

// Change user role (admin only)
router.put('/users/:id/role', auth('admin'), async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.role = role;
  await user.save();
  res.json(user);
});


// Get all pending events (admin only)
router.get('/events/pending', auth('admin'), async (req, res) => {
  const pendingEvents = await Event.find({ status: 'pending' }).populate('organizer', 'name email');
  res.json(pendingEvents);
});


// Approve or reject event (admin only)
router.put('/events/:id/status', auth('admin'), async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  ev.status = status;
  await ev.save();
  res.json(ev);
});

module.exports = router;
