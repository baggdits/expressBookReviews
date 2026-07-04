const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!isValid(username)) {
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
  } else {
    return res.status(409).json({ message: "User already exists" });
  }
});


// Get all books
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});


// Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: "Book not found" });
});


// Get books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  let result = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author.toLowerCase() === author) {
      result[isbn] = books[isbn];
    }
  });

  return Object.keys(result).length > 0
    ? res.status(200).json(result)
    : res.status(404).json({ message: "No books found for this author" });
});


// Get books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  let result = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title.toLowerCase() === title) {
      result[isbn] = books[isbn];
    }
  });

  return Object.keys(result).length > 0
    ? res.status(200).json(result)
    : res.status(404).json({ message: "No books found for this title" });
});


// Get book reviews by ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});


module.exports.general = public_users;
