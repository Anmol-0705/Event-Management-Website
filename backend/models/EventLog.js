// backend/models/EventLog.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventLogSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  action: { type: String, enum: ['approved', 'rejected', 'deleted', 'updated'], required: true },
  by: { type: Schema.Types.ObjectId, ref: 'User' }, // admin or organizer who performed the action
  reason: { type: String }, // optional (useful for rejection reason)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('EventLog', EventLogSchema);
