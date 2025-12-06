
// const express = require('express');
// const router = express.Router();
// const Event = require('../models/Event');
// const EventLog = require('../models/EventLog');
// const auth = require('../middleware/auth');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // === MULTER CONFIGURATION ===
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = path.join(__dirname, '..', 'uploads');
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     // keep filename unique
//     const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
//     cb(null, uniqueSuffix);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
//   if (allowedTypes.includes(file.mimetype)) cb(null, true);
//   else cb(new Error('Invalid file type. Only images are allowed.'), false);
// };

// const upload = multer({ storage, fileFilter });

// // === ROUTES ===

// // Create event (organizer only)
// router.post('/', auth('organizer'), upload.single('poster'), async (req, res) => {
//   try {
//     const { title, description, price, date, location } = req.body;

//     // Use filename to avoid Windows backslash issues; store as public path
//     const posterPath = req.file ? `/uploads/${req.file.filename}` : null;

//     const eventData = {
//       title,
//       description,
//       price: price ? Number(price) : 0,
//       poster: posterPath,
//       organizer: req.user._id,
//       status: 'pending',
//       date,
//       location,
//     };

//     const ev = new Event(eventData);
//     await ev.save();

//     // Log creation
//     await EventLog.create({ event: ev._id, action: 'created', by: req.user._id, reason: 'created' });

//     res.json(ev);
//   } catch (err) {
//     console.error('Error creating event:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Admin-only: get ALL events (including rejected/pending)
// router.get('/all', auth('admin'), async (req, res) => {
//   try {
//     const events = await Event.find({}).populate('organizer', 'name email');
//     res.json(Array.isArray(events) ? events : []);
//   } catch (err) {
//     console.error('Error fetching all events:', err);
//     res.status(500).json({ message: 'Error fetching events' });
//   }
// });

// // Organizer (or admin) - get my events
// // IMPORTANT: keep this above the '/:id' route
// router.get('/mine', auth(['organizer', 'admin']), async (req, res) => {
//   try {
//     // admin may pass ?organizer=<id> to view a particular organizer's events
//     if (req.user.role === 'admin' && req.query.organizer) {
//       const events = await Event.find({ organizer: req.query.organizer }).populate('organizer', 'name email');
//       return res.json(Array.isArray(events) ? events : []);
//     }
//     const events = await Event.find({ organizer: req.user._id }).populate('organizer', 'name email');
//     res.json(Array.isArray(events) ? events : []);
//   } catch (err) {
//     console.error('Error fetching my events:', err);
//     res.status(500).json({ message: 'Error fetching events' });
//   }
// });

// // Public: Get events (only approved/open for normal users)
// router.get('/', async (req, res) => {
//   try {
//     const events = await Event.find({ status: 'approved' }).populate('organizer', 'name email');
//     res.json(Array.isArray(events) ? events : []);
//   } catch (error) {
//     console.error('Error fetching events:', error);
//     res.status(500).json({ message: 'Error fetching events' });
//   }
// });

// // Get single event (public)
// router.get('/:id', async (req, res) => {
//   try {
//     const ev = await Event.findById(req.params.id).populate('organizer', 'name email');
//     if (!ev) return res.status(404).json({ message: 'Not found' });
//     res.json(ev);
//   } catch (err) {
//     console.error('Error fetching event:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Update event (organizer or admin)
// router.put('/:id', auth(['organizer', 'admin']), upload.single('poster'), async (req, res) => {
//   try {
//     const ev = await Event.findById(req.params.id);
//     if (!ev) return res.status(404).json({ message: 'Not found' });

//     // only admin or organizer-owner can edit
//     if (req.user.role === 'organizer' && ev.organizer.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not allowed' });
//     }

//     // if poster file uploaded, replace (use filename)
//     if (req.file) {
//       const posterPath = `/uploads/${req.file.filename}`;

//       // OPTIONAL: delete old poster file (if stored and exists)
//       // if (ev.poster) {
//       //   const old = path.join(__dirname, '..', ev.poster.startsWith('/') ? ev.poster.slice(1) : ev.poster);
//       //   if (fs.existsSync(old)) {
//       //     try { fs.unlinkSync(old); } catch (e) { console.warn('Failed deleting old poster', old, e); }
//       //   }
//       // }

//       ev.poster = posterPath;
//     }

//     // update other fields from body (safe fields)
//     const allowedFields = ['title', 'description', 'price', 'date', 'location'];
//     allowedFields.forEach((f) => {
//       if (typeof req.body[f] !== 'undefined') {
//         ev[f] = f === 'price' ? Number(req.body[f]) : req.body[f];
//       }
//     });

//     await ev.save();

//     await EventLog.create({ event: ev._id, action: 'updated', by: req.user._id, reason: 'edited' });

//     res.json(ev);
//   } catch (err) {
//     console.error('Error updating event:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Admin-only: change status (approve/reject)
// router.put('/:id/status', auth('admin'), async (req, res) => {
//   try {
//     const { status, reason } = req.body;
//     if (!['approved', 'rejected', 'pending'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status' });
//     }

//     const ev = await Event.findById(req.params.id);
//     if (!ev) return res.status(404).json({ message: 'Not found' });

//     ev.status = status;
//     await ev.save();

//     await EventLog.create({
//       event: ev._id,
//       action: status === 'approved' ? 'approved' : 'rejected',
//       by: req.user._id,
//       reason: reason || '',
//     });

//     res.json({ message: 'Status updated', event: ev });
//   } catch (err) {
//     console.error('Error updating status:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Admin-only: get logs for an event
// router.get('/:id/logs', auth('admin'), async (req, res) => {
//   try {
//     const logs = await EventLog.find({ event: req.params.id }).populate('by', 'name email').sort({ createdAt: -1 });
//     res.json(Array.isArray(logs) ? logs : []);
//   } catch (err) {
//     console.error('Error fetching logs:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Delete event (admin OR organizer-owner). When admin deletes -> log with deleted action
// router.delete('/:id', auth(['organizer', 'admin']), async (req, res) => {
//   try {
//     const ev = await Event.findById(req.params.id);
//     if (!ev) return res.status(404).json({ message: 'Not found' });

//     if (req.user.role === 'organizer' && ev.organizer.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not allowed' });
//     }

//     // OPTIONAL: delete poster file from disk
//     // if (ev.poster) {
//     //   const old = path.join(__dirname, '..', ev.poster.startsWith('/') ? ev.poster.slice(1) : ev.poster);
//     //   if (fs.existsSync(old)) {
//     //     try { fs.unlinkSync(old); } catch (e) { console.warn('Failed deleting poster', old, e); }
//     //   }
//     // }

//     await ev.remove();

//     await EventLog.create({
//       event: ev._id,
//       action: 'deleted',
//       by: req.user._id,
//       reason: req.body?.reason || '',
//     });

//     res.json({ message: 'Deleted' });
//   } catch (err) {
//     console.error('Error deleting event:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;

// backend/routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const EventLog = require('../models/EventLog');
const auth = require('../middleware/auth'); // expects auth(role | [roles])
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// === MULTER CONFIG ===
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type. Only images allowed.'), false);
};

const upload = multer({ storage, fileFilter });

// === ROUTES ===

// Create event (organizer only)
router.post('/', auth('organizer'), upload.single('poster'), async (req, res) => {
  try {
    const { title, description, price, date, location, venue, capacity } = req.body;
    const posterPath = req.file ? `/uploads/${req.file.filename}` : null;

    const ev = new Event({
      title,
      description,
      price: price ? Number(price) : 0,
      date: date ? new Date(date) : undefined,
      location,
      venue,
      capacity: capacity ? Number(capacity) : undefined,
      poster: posterPath,
      organizer: req.user._id,
      status: 'pending',
    });

    await ev.save();
    await EventLog.create({ event: ev._id, action: 'created', by: req.user._id, reason: 'created by organizer' });

    res.json(ev);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: err.message });
  }
});

// Public: Get approved events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' }).populate('organizer', 'name email');
    res.json(Array.isArray(events) ? events : []);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Admin-only: get ALL events (including pending/rejected)
router.get('/all', auth('admin'), async (req, res) => {
  try {
    const events = await Event.find({}).populate('organizer', 'name email');
    res.json(Array.isArray(events) ? events : []);
  } catch (err) {
    console.error('Error fetching all events:', err);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Organizer or admin: get their events (or admin with ?organizer=ID)
router.get('/mine', auth(['organizer', 'admin']), async (req, res) => {
  try {
    if (req.user.role === 'admin' && req.query.organizer) {
      const events = await Event.find({ organizer: req.query.organizer }).populate('organizer', 'name email');
      return res.json(Array.isArray(events) ? events : []);
    }
    const events = await Event.find({ organizer: req.user._id }).populate('organizer', 'name email');
    res.json(Array.isArray(events) ? events : []);
  } catch (err) {
    console.error('Error fetching my events:', err);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Get single event (public)
router.get('/:id', async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (!ev) return res.status(404).json({ message: 'Not found' });
    res.json(ev);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update event (organizer-owner or admin). Accept poster via form-data too.
// router.put('/:id', auth(['organizer', 'admin']), upload.single('poster'), async (req, res) => {
//   try {
//     const ev = await Event.findById(req.params.id);
//     if (!ev) return res.status(404).json({ message: 'Not found' });

//     if (req.user.role === 'organizer' && ev.organizer.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not allowed' });
//     }

//     // Replace poster if uploaded
//     if (req.file) {
//       const posterPath = `/uploads/${req.file.filename}`;
//       // optional: delete old file
//       if (ev.poster && ev.poster.startsWith('/uploads/')) {
//         try {
//           const old = path.join(__dirname, '..', ev.poster.slice(1));
//           if (fs.existsSync(old)) fs.unlinkSync(old);
//         } catch (e) {
//           console.warn('Failed to remove old poster', e);
//         }
//       }
//       ev.poster = posterPath;
//       await EventLog.create({ event: ev._id, action: 'poster-updated', by: req.user._id, reason: 'poster replaced' });
//     }

//     // Safe update fields
//     const allowed = ['title', 'description', 'price', 'date', 'location', 'venue', 'capacity'];
//     allowed.forEach((f) => {
//       if (typeof req.body[f] !== 'undefined') {
//         ev[f] = f === 'price' || f === 'capacity' ? Number(req.body[f]) : req.body[f];
//       }
//     });

//     // If organizer edits, optionally change status back to pending for re-review.
//     if (req.user.role === 'organizer') {
//       ev.status = 'pending';
//     }

//     await ev.save();
//     await EventLog.create({ event: ev._id, action: 'updated', by: req.user._id, reason: req.body.reason || 'edited' });

//     res.json(ev);
//   } catch (err) {
//     console.error('Error updating event:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// Update event (organizer-owner or admin). Accept poster via form-data too.
router.put('/:id', auth(['organizer', 'admin']), upload.single('poster'), async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Not found' });

    // only admin or organizer-owner can edit
    if (req.user.role === 'organizer' && ev.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    // Replace poster if uploaded
    if (req.file) {
      const posterPath = `/uploads/${req.file.filename}`;
      // optional: delete old file
      if (ev.poster && ev.poster.startsWith('/uploads/')) {
        try {
          const old = path.join(__dirname, '..', ev.poster.slice(1));
          if (fs.existsSync(old)) fs.unlinkSync(old);
        } catch (e) {
          console.warn('Failed to remove old poster', e);
        }
      }
      ev.poster = posterPath;
      await EventLog.create({ event: ev._id, action: 'poster-updated', by: req.user._id, reason: 'poster replaced' });
    }

    // Safe update fields (do NOT change status automatically)
    const allowed = ['title', 'description', 'price', 'date', 'location', 'venue', 'capacity'];
    allowed.forEach((f) => {
      if (typeof req.body[f] !== 'undefined') {
        ev[f] = f === 'price' || f === 'capacity' ? Number(req.body[f]) : req.body[f];
      }
    });

    // IMPORTANT: do NOT force status change here.
    // If you want edits by organizers to trigger re-review, set ev.status = 'pending' here.
    // But per your requirement, we keep the existing status (so approved stays approved).

    await ev.save();
    await EventLog.create({ event: ev._id, action: 'updated', by: req.user._id, reason: req.body.reason || 'edited' });

    res.json(ev);
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ message: err.message });
  }
});


// Poster-specific endpoints (admin/organizer-owner)
router.put('/:id/poster', auth(['organizer', 'admin']), upload.single('poster'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Not found' });

    if (req.user.role === 'organizer' && ev.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const posterPath = `/uploads/${req.file.filename}`;
    // delete old if present
    if (ev.poster && ev.poster.startsWith('/uploads/')) {
      try {
        const old = path.join(__dirname, '..', ev.poster.slice(1));
        if (fs.existsSync(old)) fs.unlinkSync(old);
      } catch (e) {
        console.warn('Failed to remove old poster', e);
      }
    }
    ev.poster = posterPath;
    await ev.save();

    await EventLog.create({ event: ev._id, action: 'poster-updated', by: req.user._id, reason: 'poster upload' });

    res.json(ev);
  } catch (err) {
    console.error('Error updating poster:', err);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id/poster', auth(['organizer', 'admin']), async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Not found' });

    if (req.user.role === 'organizer' && ev.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    if (ev.poster && ev.poster.startsWith('/uploads/')) {
      try {
        const old = path.join(__dirname, '..', ev.poster.slice(1));
        if (fs.existsSync(old)) fs.unlinkSync(old);
      } catch (e) {
        console.warn('Failed to remove poster', e);
      }
    }

    ev.poster = undefined;
    await ev.save();

    await EventLog.create({ event: ev._id, action: 'updated', by: req.user._id, reason: 'poster removed' });

    res.json({ message: 'Poster removed' });
  } catch (err) {
    console.error('Error deleting poster:', err);
    res.status(500).json({ message: err.message });
  }
});

// Admin-only: change status (approve/reject/pending)
router.put('/:id/status', auth('admin'), async (req, res) => {
  try {
    const { status, reason } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Not found' });

    ev.status = status;
    await ev.save();

    await EventLog.create({
      event: ev._id,
      action: status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated',
      by: req.user._id,
      reason: reason || ''
    });

    res.json({ message: 'Status updated', event: ev });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ message: err.message });
  }
});

// Admin-only: get logs for an event
// Delete event (admin OR organizer-owner). When admin deletes -> log with deleted action
router.delete('/:id', auth(['organizer', 'admin']), async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Not found' });

    if (req.user.role === 'organizer' && ev.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    // optional: delete poster file if exists
    if (ev.poster && ev.poster.startsWith('/uploads/')) {
      try {
        const old = path.join(__dirname, '..', ev.poster.slice(1));
        if (fs.existsSync(old)) fs.unlinkSync(old);
      } catch (e) {
        console.warn('Failed deleting poster', e);
      }
    }

    // Use findByIdAndDelete so we don't depend on instance methods
    await Event.findByIdAndDelete(req.params.id);

    await EventLog.create({
      event: req.params.id,
      action: 'deleted',
      by: req.user._id,
      reason: req.body?.reason || '',
    });

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
