const express = require('express');
const router = express.Router();
const product = require('../models/product');

// Create POST API
router.post('/', async (req, res) => {
    try {
        const productData = req.body;

        // Check if productData is an array
        if (!Array.isArray(productData)) {
            return res.status(400).json({ message: 'Invalid product data format' });
        }

        const productRecords = await product.insertMany(productData);
        res.status(201).json(productRecords);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to save product data'
        });
    }
});

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await product.find();
        res.status(200).json(products);
    } catch (error) {  // Define error variable
        console.error(error);
        res.status(500).json({
            message: 'Failed to retrieve products'
        });
    }
});

// GET product by ID
router.get('/:productId', async (req, res) => {
    try {
        const { productId } = req.params; // Get productId
        const productRecord = await product.findById(productId); // Use findById for a single record

        if (!productRecord) { // Check if product exists
            return res.status(404).json({
                message: 'No product records found'
            });
        }

        res.status(200).json(productRecord);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to retrieve product'
        });
    }
});

module.exports = router;
