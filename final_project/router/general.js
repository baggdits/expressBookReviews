const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js'); // local books data
const public_users = express.Router();

// Base URL for Axios requests (server itself)
const BASE_URL = "http://localhost:5000";

// --------------------
// Task 10: Get all books
// --------------------
public_users.get('/books', async (req, res) => {
    try {
        // Directly return local books (you could also fetch via Axios)
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book list", error: error.message });
    }
});

// --------------------
// Task 11: Get book by ISBN
// --------------------
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        if (books[isbn]) {
            res.json(books[isbn]);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book", error: error.message });
    }
});

// --------------------
// Task 12: Get book(s) by Author
// --------------------
public_users.get('/author/:author', async (req, res) => {
    const requestedAuthor = req.params.author.toLowerCase();
    try {
        const matchedBooks = Object.values(books).filter(
            book => book.author.toLowerCase() === requestedAuthor
        );

        if (matchedBooks.length > 0) {
            res.json(matchedBooks);
        } else {
            res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});

// --------------------
// Task 13: Get book(s) by Title
// --------------------
public_users.get('/title/:title', async (req, res) => {
    const requestedTitle = req.params.title.toLowerCase();
    try {
        const matchedBooks = Object.values(books).filter(
            book => book.title.toLowerCase() === requestedTitle
        );

        if (matchedBooks.length > 0) {
            res.json(matchedBooks);
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
});

// --------------------
// Get book reviews
// --------------------
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        if (books[isbn]) {
            res.json({ reviews: books[isbn].reviews });
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book reviews", error: error.message });
    }
});

module.exports.general = public_users;

