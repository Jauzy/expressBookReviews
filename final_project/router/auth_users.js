const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let username = req.session.authorization['username'];

  if(!username) res.status(400).json({ message: 'Not logged in' })

  let result = Object.entries(books).find(item => (item[0] == req.params.isbn))
  if (result) {
    books[result[0]].reviews[username] = req.body.review
    res.status(200).send(books[result[0]])
  } else {
    res.status(404).json({ message: 'Book not found' })
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization['username'];

  if(!username) res.status(400).json({ message: 'Not logged in' })

  let result = Object.entries(books).find(item => (item[0] == req.params.isbn))
  if (result) {
    delete books[result[0]].reviews[username]
    res.status(200).send(books[result[0]])
  } else {
    res.status(404).json({ message: 'Book not found' })
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
