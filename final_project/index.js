const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session setup for /customer routes
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

// Authentication middleware for /customer/auth/*
app.use("/customer/auth/*", function auth(req, res, next) {
  // Expecting token in the header as Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1]; // Extract token
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  // Verify the token
  jwt.verify(token, "access_secret_key", (err, decoded) => {
    if (err) {
        console.error("JWT Verify Error:", err);

      return res.status(403).json({ message: "Invalid token" });
    }
    // Optionally, attach user info to request object
    req.user = decoded;
    next(); // Pass control to next middleware or route
  });
});

const PORT = 5000;

// Routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running on port", PORT));
