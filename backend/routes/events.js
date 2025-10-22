// const express = require('express');
// const router = express.Router();
// const Event = require('../models/Event');
// const auth = require('../middleware/auth');

// // Create event (organizer only)
// router.post('/', auth('organizer'), async (req, res) => {
//   try {
//     const data = { ...req.body, organizer: req.user._id };
//     const ev = new Event(data);
//     await ev.save();
//     res.json(ev);
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// // // Read all events (public)
// // router.get('/', async (req, res) => {
// //   const events = await Event.find().populate('organizer', 'name email');
// //   res.json(events);
// // });

// router.get('/', async (req, res) => {
//   try {
//     // Only show events that are NOT rejected
//     const events = await Event.find({ status: { $ne: 'rejected' } })
//       .populate('organizer', 'name email');

//     res.json(events);
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     res.status(500).json({ message: "Error fetching events" });
//   }
// });

// // Read single event
// router.get('/:id', async (req, res) => {
//   try {
//     const ev = await Event.findById(req.params.id).populate('organizer', 'name email');
//     if (!ev) return res.status(404).json({ message: 'Not found' });
//     res.json(ev);
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// // Update event (organizer or admin)
// router.put('/:id', auth(['organizer','admin']), async (req, res) => {
//   try {
//     const ev = await Event.findById(req.params.id);
//     if (!ev) return res.status(404).json({ message: 'Not found' });
//     if (req.user.role === 'organizer' && ev.organizer.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not allowed' });
//     }
//     Object.assign(ev, req.body);
//     await ev.save();
//     res.json(ev);
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// // Delete event (organizer or admin)
// router.delete('/:id', auth(['organizer','admin']), async (req, res) => {
//   try {
//     const ev = await Event.findById(req.params.id);
//     if (!ev) return res.status(404).json({ message: 'Not found' });
//     if (req.user.role === 'organizer' && ev.organizer.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not allowed' });
//     }
//     await ev.remove();
//     res.json({ message: 'Deleted' });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// module.exports = router;
// const express = require('express');
// const router = express.Router();
// const Event = require('../models/Event');
// const auth = require('../middleware/auth');
// const multer = require('multer');
// const path = require('path');

// // === MULTER CONFIGURATION ===

// // Create storage engine
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Folder where posters will be saved
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + file.originalname;
//     cb(null, uniqueSuffix);
//   },
// });

// // Only allow image uploads
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only images are allowed.'), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// // === ROUTES ===

// // Create event (organizer only)
// router.post('/', auth('organizer'), upload.single('poster'), async (req, res) => {
//   try {
//     const { title, description, price } = req.body;

//     // Poster path if uploaded
//     const posterPath = req.file ? req.file.path : null;

//     const eventData = {
//       title,
//       description,
//       price,
//       poster: posterPath,
//       organizer: req.user._id,
//       status: 'pending', // Optional default
//     };

//     const ev = new Event(eventData);
//     await ev.save();
//     res.json(ev);
//   } catch (err) {
//     console.error('Error creating event:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get all events (public)
// router.get('/', async (req, res) => {
//   try {
//     // Only show events that are NOT rejected
//     const events = await Event.find({ status: { $ne: 'rejected' } })
//       .populate('organizer', 'name email');
//     res.json(events);
//   } catch (error) {
//     console.error('Error fetching events:', error);
//     res.status(500).json({ message: 'Error fetching events' });
//   }
// });

// // Get single event
// router.get('/:id', async (req, res) => {
//   try {
//     const ev = await Event.findById(req.params.id).populate('organizer', 'name email');
//     if (!ev) return res.status(404).json({ message: 'Not found' });
//     res.json(ev);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Update event (organizer or admin)
// router.put('/:id', auth(['organizer', 'admin']), async (req, res) => {
//   try {
//     const ev = await Event.findById(req.params.id);
//     if (!ev) return res.status(404).json({ message: 'Not found' });

//     if (req.user.role === 'organizer' && ev.organizer.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not allowed' });
//     }

//     Object.assign(ev, req.body);
//     await ev.save();
//     res.json(ev);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Delete event (organizer or admin)
// router.delete('/:id', auth(['organizer', 'admin']), async (req, res) => {
//   try {
//     const ev = await Event.findById(req.params.id);
//     if (!ev) return res.status(404).json({ message: 'Not found' });

//     if (req.user.role === 'organizer' && ev.organizer.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not allowed' });
//     }

//     await ev.remove();
//     res.json({ message: 'Deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;

// backend/routes/events.js





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
//     const uploadDir = 'uploads/';
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + file.originalname;
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
//     const posterPath = req.file ? '/' + req.file.path.replace(/\\/g, '/') : null;

//     const eventData = {
//       title,
//       description,
//       price,
//       poster: posterPath,
//       organizer: req.user._id,
//       status: 'pending',
//       date,
//       location,
//     };

//     const ev = new Event(eventData);
//     await ev.save();

//     // Log creation (optional)
//     await EventLog.create({ event: ev._id, action: 'updated', by: req.user._id, reason: 'created' });

//     res.json(ev);
//   } catch (err) {
//     console.error('Error creating event:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Public: Get events (only approved/open for normal users)
// router.get('/', async (req, res) => {
//   try {
//     const events = await Event.find({ status: 'approved' }).populate('organizer', 'name email');
//     // ensure it's an array
//     res.json(Array.isArray(events) ? events : []);
//   } catch (error) {
//     console.error('Error fetching events:', error);
//     res.status(500).json({ message: 'Error fetching events' });
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

// // Get single event (public)
// router.get('/:id', async (req, res) => {
//   try {
//     const ev = await Event.findById(req.params.id).populate('organizer', 'name email');
//     if (!ev) return res.status(404).json({ message: 'Not found' });

//     // If it's rejected and requester is not admin/organizer-owner, hide it
//     // (This is optional; you can change as needed.)
//     if (ev.status === 'rejected') {
//       // if not admin and not organizer owner, return 404
//       // if no auth header, just block
//       // Attempt a best-effort: if user token exists, middleware needed; here we'll just return the event for now
//     }

//     res.json(ev);
//   } catch (err) {
//     console.error('Error fetching event:', err);
//     res.status(500).json({ message: err.message });
//   }
// });
// // Add to your events router (backend/routes/events.js)
// router.get('/mine', auth(['organizer', 'admin']), async (req, res) => {
//   try {
//     // if admin wants to see all organizer events, we can optionally allow query param ?organizer=ID
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


// // Update event (organizer or admin)
// router.put('/:id', auth(['organizer', 'admin']), upload.single('poster'), async (req, res) => {
//   try {
//     const ev = await Event.findById(req.params.id);
//     if (!ev) return res.status(404).json({ message: 'Not found' });

//     // only admin or organizer-owner can edit
//     if (req.user.role === 'organizer' && ev.organizer.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not allowed' });
//     }

//     // if poster file uploaded, replace
//     if (req.file) {
//       const posterPath = '/' + req.file.path.replace(/\\/g, '/');
//       // optional: delete old poster file (if you want)
//       ev.poster = posterPath;
//     }

//     // update other fields from body (safe fields)
//     const allowedFields = ['title', 'description', 'price', 'date', 'location'];
//     allowedFields.forEach((f) => {
//       if (typeof req.body[f] !== 'undefined') ev[f] = req.body[f];
//     });

//     // If an organizer updates, set status back to pending to re-review? (Optional)
//     // ev.status = 'pending';

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
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// === MULTER CONFIGURATION ===
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // keep filename unique
    const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type. Only images are allowed.'), false);
};

const upload = multer({ storage, fileFilter });

// === ROUTES ===

// Create event (organizer only)
router.post('/', auth('organizer'), upload.single('poster'), async (req, res) => {
  try {
    const { title, description, price, date, location } = req.body;

    // Use filename to avoid Windows backslash issues; store as public path
    const posterPath = req.file ? `/uploads/${req.file.filename}` : null;

    const eventData = {
      title,
      description,
      price: price ? Number(price) : 0,
      poster: posterPath,
      organizer: req.user._id,
      status: 'pending',
      date,
      location,
    };

    const ev = new Event(eventData);
    await ev.save();

    // Log creation
    await EventLog.create({ event: ev._id, action: 'created', by: req.user._id, reason: 'created' });

    res.json(ev);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: err.message });
  }
});

// Admin-only: get ALL events (including rejected/pending)
router.get('/all', auth('admin'), async (req, res) => {
  try {
    const events = await Event.find({}).populate('organizer', 'name email');
    res.json(Array.isArray(events) ? events : []);
  } catch (err) {
    console.error('Error fetching all events:', err);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Organizer (or admin) - get my events
// IMPORTANT: keep this above the '/:id' route
router.get('/mine', auth(['organizer', 'admin']), async (req, res) => {
  try {
    // admin may pass ?organizer=<id> to view a particular organizer's events
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

// Public: Get events (only approved/open for normal users)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' }).populate('organizer', 'name email');
    res.json(Array.isArray(events) ? events : []);
  } catch (error) {
    console.error('Error fetching events:', error);
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

// Update event (organizer or admin)
router.put('/:id', auth(['organizer', 'admin']), upload.single('poster'), async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Not found' });

    // only admin or organizer-owner can edit
    if (req.user.role === 'organizer' && ev.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    // if poster file uploaded, replace (use filename)
    if (req.file) {
      const posterPath = `/uploads/${req.file.filename}`;

      // OPTIONAL: delete old poster file (if stored and exists)
      // if (ev.poster) {
      //   const old = path.join(__dirname, '..', ev.poster.startsWith('/') ? ev.poster.slice(1) : ev.poster);
      //   if (fs.existsSync(old)) {
      //     try { fs.unlinkSync(old); } catch (e) { console.warn('Failed deleting old poster', old, e); }
      //   }
      // }

      ev.poster = posterPath;
    }

    // update other fields from body (safe fields)
    const allowedFields = ['title', 'description', 'price', 'date', 'location'];
    allowedFields.forEach((f) => {
      if (typeof req.body[f] !== 'undefined') {
        ev[f] = f === 'price' ? Number(req.body[f]) : req.body[f];
      }
    });

    await ev.save();

    await EventLog.create({ event: ev._id, action: 'updated', by: req.user._id, reason: 'edited' });

    res.json(ev);
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ message: err.message });
  }
});

// Admin-only: change status (approve/reject)
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
      action: status === 'approved' ? 'approved' : 'rejected',
      by: req.user._id,
      reason: reason || '',
    });

    res.json({ message: 'Status updated', event: ev });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ message: err.message });
  }
});

// Admin-only: get logs for an event
router.get('/:id/logs', auth('admin'), async (req, res) => {
  try {
    const logs = await EventLog.find({ event: req.params.id }).populate('by', 'name email').sort({ createdAt: -1 });
    res.json(Array.isArray(logs) ? logs : []);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ message: err.message });
  }
});

// Delete event (admin OR organizer-owner). When admin deletes -> log with deleted action
router.delete('/:id', auth(['organizer', 'admin']), async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Not found' });

    if (req.user.role === 'organizer' && ev.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    // OPTIONAL: delete poster file from disk
    // if (ev.poster) {
    //   const old = path.join(__dirname, '..', ev.poster.startsWith('/') ? ev.poster.slice(1) : ev.poster);
    //   if (fs.existsSync(old)) {
    //     try { fs.unlinkSync(old); } catch (e) { console.warn('Failed deleting poster', old, e); }
    //   }
    // }

    await ev.remove();

    await EventLog.create({
      event: ev._id,
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
