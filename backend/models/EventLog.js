// // backend/models/EventLog.js
// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const EventLogSchema = new Schema({
//   event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
//   action: { type: String, enum: ['approved', 'rejected', 'deleted', 'updated'], required: true },
//   by: { type: Schema.Types.ObjectId, ref: 'User' }, // admin or organizer who performed the action
//   reason: { type: String }, // optional (useful for rejection reason)
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('EventLog', EventLogSchema);
// backend/models/EventLog.js


// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const EventLogSchema = new Schema({
//   event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
//   action: { type: String, enum: ['created','updated','approved','rejected','deleted','poster-updated'], required: true },
//   by: { type: Schema.Types.ObjectId, ref: 'User' },
//   reason: { type: String, default: '' },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('EventLog', EventLogSchema);


// backend/models/EventLog.js
const mongoose = require('mongoose');

const eventLogSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    action: {
      type: String, // e.g. "status:approved", "status:rejected", "deleted"
      required: true,
    },
    reason: {
      type: String, // rejection reason or any comment
    },
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // admin / organizer who did it
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

module.exports = mongoose.model('EventLog', eventLogSchema);

