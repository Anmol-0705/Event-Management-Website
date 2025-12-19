// const mongoose = require('mongoose');

// const eventSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   date: Date,
//   location: String,
//   capacity: Number,
//   price: { type: Number, default: 0 }, // in rupees
//   organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   status: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Event', eventSchema);


// backend/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: Date,
  location: String,
  venue: String,            // optional friendly name
  capacity: Number,
  price: { type: Number, default: 0 }, // in rupees
  poster: String,           // store "/uploads/filename" (relative) or absolute URL
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  lastEditReason: { type: String },
  lastEditedAt: { type: Date }

});

module.exports = mongoose.model('Event', eventSchema);
