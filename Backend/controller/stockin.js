const Stockin = require("../models/stockin");

// Add Stockin
const addStockin = async (req, res) => {
  const { userID, productID, StockSold, StockinDate, TotalStockinAmount } = req.body;

  // Validate required fields
  if (!userID || !productID || !StockSold || !StockinDate || TotalStockinAmount === undefined) {
    return res.status(400).send({ error: "All fields are required." });
  }

  const addStock = new Stockin({
    userID,
    ProductID: productID,
    StockSold,
    StockinDate,
    TotalStockinAmount
  });

  try {
    const result = await addStock.save();
    await soldStock(productID, StockSold); // Assuming soldStock is defined elsewhere
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error saving stock." });
  }
};

// Get All Stockin Data
const getStockinData = async (req, res) => {
  try {
    const findAllStockinData = await Stockin.find({ userID: req.params.userID })
      .sort({ _id: -1 })
      .populate("ProductID"); // Optional: limit fields populated if necessary

    res.json(findAllStockinData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching stock data." });
  }
};

// Get total sales amount
const getTotalStockinAmount = async (req, res) => {
  try {
    let totalStockinAmount = 0;
    const stockinData = await Stockin.find({ userID: req.params.userID });

    stockinData.forEach((sto) => {
      totalStockinAmount += sto.TotalStockinAmount || 0; // Prevent NaN if undefined
    });

    res.json({ totalStockinAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error calculating total stock amount." });
  }
};

// Get Monthly Stockin grouped by ProductID
const getMonthlyStockin = async (req, res) => {
  try {
    const sales = await Stockin.aggregate([
      {
        $group: {
          _id: "$ProductID",
          totalStockinAmount: { $sum: "$TotalStockinAmount" },
          stockinData: { $push: { date: "$StockinDate", amount: "$TotalStockinAmount" } }
        }
      },
      {
        $sort: { totalStockinAmount: -1 } // Optional: sort by total amount descending
      }
    ]);

    res.status(200).json(sales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addStockin, getMonthlyStockin, getStockinData, getTotalStockinAmount };
