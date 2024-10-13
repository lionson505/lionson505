const express = require('express');
const router = express.Router();
const User = require('../models/users');

// Create a new user
router.post('/', async (req, res) => {
    try {
        // Validate request body (optional but recommended)
        const { firstName, lastName, email, password, phoneNumber, role, compassion } = req.body;
        if (!firstName || !lastName || !email || !password || !phoneNumber || !role) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Create a new user instance
        const user = new User({
            firstName,
            lastName,
            email,
            password, // Make sure to hash this password before saving
            phoneNumber,
            role,
            compassion // Include compassion field
        });

        // Save the user to the database
        await user.save();
        
        // Return the created user with a 201 status
        res.status(201).json(user);
    } catch (error) {
        // Handle specific errors (e.g., validation errors, duplicate email, etc.)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        // Handle duplicate key errors (e.g., duplicate email)
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        // For any other errors, return a generic error message
        res.status(500).json({ message: 'Server error.' });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().populate('compassion');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('compassion');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('compassion');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
