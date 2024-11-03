
const express = require("express");
const { main } = require("./models/index");
require('dotenv').config(); // Load environment variables
const productRoute = require("./router/product");
const stockinRoutes = require("./router/stockin");
// const purchaseRoute = require("./router/purchase");  
const salesRoute = require("./router/sales");
const cors = require("cors");
const User = require("./models/users");
const Product = require("./models/product");
const youthRoute = require('./router/youth');
const attendanceRoute = require('./router/attendance');
const schoolFeesRoutes = require('./router/schoolFees');
const users = require('./router/users');
const compassionRoutes = require('./router/compassion');

const app = express();
const PORT = 4000;
// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));
 
app.use(express.json());
app.use(cors());

main();
app.use(express.json());
app.use(cors());

// Store API
app.use("/api/users", users);
app.use("/api/product", productRoute);
app.use("/api/sales", salesRoute);
app.use("/api/stockin", stockinRoutes); // Use the stockin routes
app.use("/api/youth", youthRoute);
app.use("/api/attendance", attendanceRoute);
app.use('/api/schoolFees', schoolFeesRoutes);
app.use('/api/compassion', compassionRoutes);


// ------------- Login --------------
app.post("/api/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      // Create a token
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
      res.json({ user, token });
    } else {
      res.status(401).send("Invalid Credentials");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// ------------- Registration API --------------
app.post("/api/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const registerUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber,
      imageUrl: req.body.imageUrl,
      role: req.body.role,
    });
    const result = await registerUser.save();
    res.status(201).send(result);
  } catch (err) {
    console.error("Signup Error: ", err);
    res.status(500).send("Registration failed");
  }
});

// Sample test route
app.get("/testget", async (req, res) => {
  try {
    const result = await Product.findOne({ _id: '6429979b2e5434138eda1564' });
    res.json(result);
  } catch (error) {
    res.status(500).send("Error fetching product");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
