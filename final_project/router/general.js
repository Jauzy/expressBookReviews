const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  let result = books
  res.status(200).send(result)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  let result = Object.entries(books).find(item => (item[0] == req.params.isbn))
  if (result) {
    res.status(200).send(result[1])
  } else {
    res.status(404).json({ message: 'Book not found' })
  }

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  let result = Object.entries(books).find(item => (item[1].author == req.params.author))
  if (result) {
    res.status(200).send(result[1])
  } else {
    res.status(404).json({ message: 'Book not found' })
  }

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  let result = Object.entries(books).find(item => (item[1].title == req.params.title))
  if (result) {
    res.status(200).send(result[1])
  } else {
    res.status(404).json({ message: 'Book not found' })
  }

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  let result = Object.entries(books).find(item => (item[0] == req.params.isbn))
  if (result) {
    res.status(200).send(result[1].reviews)
  } else {
    res.status(404).json({ message: 'Book not found' })
  }

});

// ----------------------------------

const axios = require('axios');

public_users.get('/with-axios/', (req, res) => {
  axios.get('http://localhost:5000/') 
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((error) => {
      res.status(500).send({ error: 'Failed to retrieve books from the shop' });
    });
});

public_users.get('/with-axios/isbn/:isbn', (req, res) => {
  axios.get('http://localhost:5000/isbn/'+req.params.isbn) 
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((error) => {
      res.status(500).send({ error: 'Failed to retrieve books from the shop' });
    });
});

public_users.get('/with-axios/author/:author', (req, res) => {
  axios.get('http://localhost:5000/author/'+req.params.author) 
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((error) => {
      res.status(500).send({ error: 'Failed to retrieve books from the shop' });
    });
});

public_users.get('/with-axios/title/:title', (req, res) => {
  axios.get('http://localhost:5000/title/'+req.params.title) 
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((error) => {
      res.status(500).send({ error: 'Failed to retrieve books from the shop' });
    });
});

module.exports.general = public_users;
