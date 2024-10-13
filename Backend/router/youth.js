// routes/youth.js
const express = require('express');
const router = express.Router();
const Youth = require('../models/youth');

// Create a new youth record
router.post('/', async (req, res) => {
  const { firstName, lastName, birthday, address, educationLevel } = req.body;

  try {
    const newYouth = new Youth({ firstName, lastName, birthday, address, educationLevel });
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

module.exports = router;
