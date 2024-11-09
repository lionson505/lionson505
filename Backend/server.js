
const express = require("express");
const axios = require("axios");
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
const PORT = 4000 || process.env.DATABASE_URL;
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



// ------------- Signin --------------
let userAuthCheck;
app.post("/api/login", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

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
      alert("Signup Successfull");
    })
    .catch((err) => console.log("Signup: ", err));
  console.log("request: ", req.body);
});

// ------------------ NEW SEND SMS API ------------------

// Add this route to handle SMS sending requests
app.post("/api/send-sms", async (req, res) => {
  const { phones, message } = req.body;

  // Validate that phones and message are provided
  if (!phones || phones.length === 0 || !message) {
    return res.status(400).json({ error: "Recipient phones and message are required" });
  }

  // Define the URL for the SMS API
  const url = "https://www.intouchsms.co.rw/api/sendsms/.json";
  const username = process.env.SMS_USERNAME;  // Get the username from environment variables
  const password = process.env.SMS_PASSWORD;  // Get the password from environment variables

  // Prepare the data to be sent to the SMS API
  const data = {
    recipient: phones.join(','),  // Join the phone numbers as a comma-separated string
    message: message,
  };

  try {
    // Make the POST request to the IntouchSMS API using axios
    const response = await axios.post(url, new URLSearchParams(data), {
      auth: {
        username: username,  // Use basic authentication with username and password
        password: password,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // If the API request is successful, send the response data to the client
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error sending SMS:", error);
    // If there is an error, send a failure response
    res.status(500).json({ error: "Failed to send SMS", details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
