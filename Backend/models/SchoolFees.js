const mongoose = require('mongoose');

// Define the schema for School Fees
const schoolFeeSchema = new mongoose.Schema({
    totalFees: {
        type: Number,
        required: true, // Total fees must be provided
    },
    schoolAccount: {
        type: String,
        required: true, // School account must be provided
    },
    hiddenValue: {
        type: String,
        required: true, // Hidden value must be provided
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
    // userID: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "users",
    //   required: true,
    // },
});

// Create the model based on the schema
const SchoolFee = mongoose.model('SchoolFee', schoolFeeSchema);

module.exports = SchoolFee;
