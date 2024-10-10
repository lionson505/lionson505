const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  youthId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Youth' // Ensure this references the correct model
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'saved'], // Adjust as necessary
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Optional, depending on your requirements
  },
  compassion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'compassion' // Optional, depending on your requirements
  },
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
