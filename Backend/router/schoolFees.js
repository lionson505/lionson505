const express = require('express');
const router = express.Router();
const SchoolFee = require('../models/schoolFees');

// POST route to submit school fees
router.post('/', async (req, res) => {
    const { totalFees, schoolAccount, hiddenValue } = req.body;

    try {
        const newSchoolFee = new SchoolFee({
            totalFees,
            schoolAccount,
            hiddenValue,
        });

        await newSchoolFee.save();
        res.status(201).json({ message: 'School fees submitted successfully', data: newSchoolFee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving school fees', error: error.message });
    }
});

// GET route to retrieve all school fees
router.get('/', async (req, res) => {
    try {
        const schoolFees = await SchoolFee.find();
        res.status(200).json(schoolFees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving school fees', error: error.message });
    }
});

// GET route to retrieve a specific school fee by ID
router.get('/:id', async (req, res) => {
    try {
        const schoolFee = await SchoolFee.findById(req.params.id);
        if (!schoolFee) {
            return res.status(404).json({ message: 'School fee not found' });
        }
        res.status(200).json(schoolFee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving school fee', error: error.message });
    }
});

// PUT route to update a school fee by ID
router.put('/:id', async (req, res) => {
    const { totalFees, schoolAccount, hiddenValue } = req.body;

    try {
        const updatedSchoolFee = await SchoolFee.findByIdAndUpdate(
            req.params.id,
            { totalFees, schoolAccount, hiddenValue },
            { new: true, runValidators: true }
        );

        if (!updatedSchoolFee) {
            return res.status(404).json({ message: 'School fee not found' });
        }

        res.status(200).json({ message: 'School fee updated successfully', data: updatedSchoolFee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating school fee', error: error.message });
    }
});

// DELETE route to remove a school fee by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedSchoolFee = await SchoolFee.findByIdAndDelete(req.params.id);
        if (!deletedSchoolFee) {
            return res.status(404).json({ message: 'School fee not found' });
        }
        res.status(200).json({ message: 'School fee deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting school fee', error: error.message });
    }
});

module.exports = router;
