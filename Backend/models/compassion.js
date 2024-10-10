const mongoose = require('mongoose');

const compassionSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    church: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
});

const Compassion = mongoose.model('Compassion', compassionSchema);

module.exports = Compassion;
