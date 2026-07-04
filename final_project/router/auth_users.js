const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

const SECRET_KEY = "library_secret_key";


// Check if username already exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};


// Check username + password match
const authenticatedUser = (username, password) => {
  return users.some(
    user => user.username === username && user.password === password
  );
};


// LOGIN (only registered users)
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login credentials" });
  }

  const token = jwt.sign(
    { username },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  return res.status(200).json({ message: "Login successful", token });
});


// Add/Update a book review (protected route)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user?.username; // usually set by middleware

  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});


// Export functions
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
