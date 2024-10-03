// routes/storeRoutes.js
const express = require('express');
const multer = require('multer');
const Store = require('../models/store');
const router = express.Router();

// Configure multer for image uploads
const storage = multer.memoryStorage(); // Store images in memory (can also use diskStorage)
const upload = multer({ storage: storage });

// Add a new store with an image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const storeData = {
      userId: req.body.userId,
      name: req.body.name,
      category: req.body.category,
      address: req.body.address,
      city: req.body.city,
      image: req.file ? req.file.buffer.toString('base64') : '', // Convert image buffer to base64
    };

    const store = new Store(storeData);
    await store.save();
    res.status(201).json({ message: 'Store created successfully!', store });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get stores by user ID
router.get('/get/:userId', async (req, res) => {
  try {
    const stores = await Store.find({ userId: req.params.userId });
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a store by ID
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a store
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.buffer.toString('base64'); // Convert image buffer to base64
    }
    
    const store = await Store.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a store
router.delete('/:id', async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
