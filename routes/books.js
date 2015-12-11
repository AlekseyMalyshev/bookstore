'use strict';

let ObjectID = require('mongodb').ObjectID;
let express = require('express');
let router = express.Router();

let Book = require('../models/book');

let checkError = (err, res, book) => {
  if (err) {
    console.log('err: ', err);
    res.status(400).send(err);
  }
  else {
    res.json(book);
  }
}

router.get('/', (req, res) => {
  console.log('Getting all books');
  Book.find({}, null, {sort: 'author title'}, (err, books) => {
      checkError(err, res, books);
    });
});

module.exports = router;
