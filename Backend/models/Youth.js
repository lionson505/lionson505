// models/Youth.js
const mongoose = require('mongoose');

const youthSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthday: { type: Date, required: true },
  address: { type: String, required: true },
  educationLevel: { type: String, required: true }
});

module.exports = mongoose.model('Youth', youthSchema);
