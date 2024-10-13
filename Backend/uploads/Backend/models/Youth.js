// models/Youth.js
const mongoose = require('mongoose');

const youthSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  compassion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthday: { type: Date, required: true },
  address: { type: String, required: true },sex: { 
    type: String, 
    enum: ['male', 'female', 'non-binary'], 
    required: true 
  },
  educationLevel: { type: String, required: true },
  schoolName: { type: String, required: true } // Added school name
});

module.exports = mongoose.model('Youth', youthSchema);
