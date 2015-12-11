'use strict';

let mongoose = require('mongoose');

let Book = require('./book');

let books = [
  {
    title: 'The Sea-Wolf',
    author: 'Jack London',
    price: '4.50'
  },
  {
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    price: '4.99'
  },
  {
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    price: '12.99'
  },
  {
    title: 'Anna Karenina',
    author: 'Leo Tolstoy',
    price: '12.99'
  },
  {
    title: 'Lolita',
    author: 'Vladimir Nabokov',
    price: '12.99'
  },
  {
    title: 'Crime and Punishment',
    author: 'Fyodor Dostoyevsky',
    price: '14.95'
  },
  {
    title: 'The Brothers Karamazov',
    author: 'Fyodor Dostoyevsky',
    price: '14.95'
  },
  {
    title: 'The Financier',
    author: 'Theodore Dreiser',
    price: '11.99'
  },
  {
    title: 'The Last of the Mohicans',
    author: 'James Fenimore Cooper',
    price: '14.99'
  },
  {
    title: 'Osceola the Seminole',
    author: 'Thomas Mayne Reid',
    price: '9.99'
  },
  {
    title: 'The Jungle Book',
    author: 'Rudyard Kipling',
    price: '5.99'
  },
  {
    title: 'Rikki-Tikki-Tavi',
    author: 'Rudyard Kipling',
    price: '9.99'
  }];


let DATABASE = process.env.MONGOLAB_URI || 'mongodb://localhost/bookstore';
console.log('Connecting to mongodb: ', DATABASE);
mongoose.connect(DATABASE);

let collection = mongoose.connection.collections['books'];

if (collection === undefined) {
  init();
}
else {
  collection.drop(function(err) {
    if (err) {
      console.log('Failed to drop collection');
      console.error(err);
    }
    else {
      console.log('Dropped collection');
    }
    init();
  });
}

function init() {
  Book.create(books, function(err) {
    if (err) {
      console.log('Failed to initialize survey collection');
      console.error(err);
    }
    else {
      console.log('Successfully initialized survey collection');
    }
    process.exit();
  });
};
