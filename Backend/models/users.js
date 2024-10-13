const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    imageUrl: { type: String },
    role: {
        type: String,
        enum: ['pd', 'pcd', 'teacher', 'burser', 'auditor'],
        required: true
    },
    compassion: { type: mongoose.Schema.Types.ObjectId, ref: 'Compassion' } // Reference to Compassion
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
