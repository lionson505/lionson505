// models/storeModel.js
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Electronics', 'Groceries', 'Wholesale', 'SuperMart', 'Phones'], // Define your categories
    default: 'Electronics',
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL of the image
  },
}, { timestamps: true });

const Store = mongoose.model('store', storeSchema);

module.exports = Store;
