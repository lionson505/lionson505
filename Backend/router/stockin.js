const express = require('express');
const Stockin = require('../models/stockin'); // Adjust the path as necessary
const router = express.Router();

// Create a new stock entry
router.post('/', async (req, res) => {
  try {
    const stockin = new Stockin(req.body);
    await stockin.save();
    res.status(201).send(stockin);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all stock entries
router.get('/', async (req, res) => {
  try {
    const stockins = await Stockin.find().populate('ProductID')
    .sort({ _id: -1 });
    res.status(200).send(stockins);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Get a stockin by ID
router.get('/sto/:id', async (req, res) => {
    try {
      const stockin = await Stockin.findById(req.params.id)
      .sort({ _id: -1 });
      if (!stockin) {
        return res.status(404).json({ message: 'Stockin not found' });
      }
      res.status(200).json(stockin);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Get youth records by user ID
router.get('/:userID', async (req, res) => {
    try {
      const stockin = await Stockin.find({ userID: req.params.userID })
      .sort({ _id: -1 })
      .populate("ProductID");
      res.status(200).json(stockin)
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

// Update a stock entry by ID
router.patch('/:id', async (req, res) => {
  try {
    const stockin = await Stockin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!stockin) {
      return res.status(404).send();
    }
    res.status(200).send(stockin);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a stock entry by ID
router.delete('/:id', async (req, res) => {
  try {
    const stockin = await Stockin.findByIdAndDelete(req.params.id);
    if (!stockin) {
      return res.status(404).send();
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
