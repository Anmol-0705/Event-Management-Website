const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Create event (organizer only)
router.post('/', auth('organizer'), async (req, res) => {
  try {
    const data = { ...req.body, organizer: req.user._id };
    const ev = new Event(data);
    await ev.save();
    res.json(ev);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// // Read all events (public)
// router.get('/', async (req, res) => {
//   const events = await Event.find().populate('organizer', 'name email');
//   res.json(events);
// });

router.get('/', async (req, res) => {
  try {
    // Only show events that are NOT rejected
    const events = await Event.find({ status: { $ne: 'rejected' } })
      .populate('organizer', 'name email');
      
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
});

// Read single event
router.get('/:id', async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (!ev) return res.status(404).json({ message: 'Not found' });
    res.json(ev);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update event (organizer or admin)
router.put('/:id', auth(['organizer','admin']), async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Not found' });
    if (req.user.role === 'organizer' && ev.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    Object.assign(ev, req.body);
    await ev.save();
    res.json(ev);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete event (organizer or admin)
router.delete('/:id', auth(['organizer','admin']), async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Not found' });
    if (req.user.role === 'organizer' && ev.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    await ev.remove();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
