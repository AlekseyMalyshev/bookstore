'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let bookSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    updated: {type: Date, default: Date.now}
  }
);

module.exports = mongoose.model('books', bookSchema);
