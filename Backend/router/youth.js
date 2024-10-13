const express = require('express');
const router = express.Router();
const Youth = require('../models/youth');

// Create a new youth record
router.post('/', async (req, res) => {
  const { userID, firstName, lastName, birthday, address, sex, educationLevel, schoolName,compassion } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !birthday || !address || !sex || !educationLevel || !schoolName) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newYouth = new Youth({ userID, firstName, lastName, birthday, address, sex, educationLevel, schoolName,compassion });
    await newYouth.save();
    res.status(201).json(newYouth);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all youth records
router.get('/', async (req, res) => {
  try {
    const youths = await Youth.find();
    res.status(200).json(youths);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get youth records by user ID
router.get('/:userID', async (req, res) => {
  try {
    const youths = await Youth.find({ userID: req.params.userID });
    res.status(200).json(youths);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a youth record by ID
router.put('/:id', async (req, res) => {
  const { firstName, lastName, birthday, address, sex, educationLevel, schoolName } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !birthday || !address || !sex || !educationLevel || !schoolName) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const updatedYouth = await Youth.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, birthday, address, sex, educationLevel, schoolName },
      { new: true, runValidators: true } // Returns the updated document
    );

    if (!updatedYouth) {
      return res.status(404).json({ message: 'Youth not found.' });
    }

    res.status(200).json(updatedYouth);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
