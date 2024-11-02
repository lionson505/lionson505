const mongoose = require("mongoose");

const StockinSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    ProductID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    // StoreID: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "store",
    //   required: true,
    // },
    StockSold: {
      type: Number,
      required: true,
    },
    StockinDate: {
      type: String,
      required: true,
    },
    TotalSaleAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Stockin = mongoose.model("Stockin", StockinSchema);
module.exports = Stockin;
