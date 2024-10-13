const express = require('express');
const router = express.Router();
const Compassion = require('../models/compassion');

// Create a new compassion record
router.post('/', async (req, res) => {
    const { code, name, church, address, phone, email } = req.body;

    try {
        const compassion = new Compassion({ code, name, church, address, phone, email });
        await compassion.save();
        res.status(201).json(compassion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all compassion records
router.get('/', async (req, res) => {
    try {
        const compassionRecords = await Compassion.find();
        res.status(200).json(compassionRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single compassion record by ID
router.get('/:id', async (req, res) => {
    try {
        const compassion = await Compassion.findById(req.params.id);
        if (!compassion) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(compassion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a compassion record
router.put('/:id', async (req, res) => {
    try {
        const compassion = await Compassion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!compassion) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(compassion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a compassion record
router.delete('/:id', async (req, res) => {
    try {
        const compassion = await Compassion.findByIdAndDelete(req.params.id);
        if (!compassion) return res.status(404).json({ message: 'Not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
