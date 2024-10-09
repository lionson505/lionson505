const express = require("express");
const { main } = require("./models/index");
const productRoute = require("./router/product");
const storeRoute = require("./router/store");
const purchaseRoute = require("./router/purchase");
const salesRoute = require("./router/sales");
const cors = require("cors");
const User = require("./models/users");
const Product = require("./models/Product");
const youthRoute = require('./router/youth');
const attendanceRoute = require('./router/attendance');
const schoolFeesRoutes = require('./router/schoolFees');
const users = require('./router/users');
const compassionRoutes = require('./router/compassion');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 4000; // Use the PORT from .env or default to 4000
main();
app.use(express.json());
app.use(cors());

// Store API
app.use("/api/users", users);

// Store API
app.use("/api/store", storeRoute);

// Products API
app.use("/api/product", productRoute);

// Purchase API
app.use("/api/purchase", purchaseRoute);

// Sales API
app.use("/api/sales", salesRoute);

// Youth API
app.use("/api/youth", youthRoute);

// Attendance API
app.use("/api/attendance", attendanceRoute);

// Use the school fees route
app.use('/api/schoolFees', schoolFeesRoutes);

// Compassion API
app.use('/api/compassion', compassionRoutes);

// ------------- Signin --------------
let userAuthCheck;
app.post("/api/login", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    }).populate('compassion'); // Populate compassion data

    console.log("USER: ", user);
    if (user) {
      res.send(user);
      userAuthCheck = user;
    } else {
      res.status(401).send("Invalid Credentials");
      userAuthCheck = null;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Getting User Details of logged-in user
app.get("/api/login", (req, res) => {
  res.send(userAuthCheck);
});

// Registration API
app.post("/api/register", (req, res) => {
  let registerUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    imageUrl: req.body.imageUrl,
    role: req.body.role,
  });

  registerUser
    .save()
    .then((result) => {
      res.status(200).send(result);
      alert("Signup Successful");
    })
    .catch((err) => console.log("Signup: ", err));
  console.log("request: ", req.body);
});

app.get("/testget", async (req, res) => {
  const result = await Product.findOne({ _id: '6429979b2e5434138eda1564' });
  res.json(result);
});

// Here we are listening to the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
