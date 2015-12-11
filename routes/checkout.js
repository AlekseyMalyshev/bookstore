'use strict';

let express = require('express');
let router = express.Router();
let stripe = require("stripe")(process.env.STRIPE_SECRET);

let User = require('../models/user');


function updateUser(userId, cart) {
  let bookIds = cart.map((book) => book._id);
  console.log(bookIds);
  User.findOneAndUpdate({_id: userId},
   { $pullAll: { cart: bookIds } },
   {new: true}, (err, doc) => {
    if (err) {
      console.err('Filed to update user', userId, err);
    }
  });
}

router.post('/', function(req, res) {
  let tokenObj = req.body.token;
  let cart = req.body.cart;
  if (!tokenObj || !cart) {
    res.status(400).send('Error');
    return;
  }

  let total = cart.reduce((total, book) => total + book.price, 0);
  console.log('total: ', total);

  let charge = stripe.charges.create({
    amount: Math.round(total * 100),
    currency: "USD",
    source: tokenObj.id,
    description: 'Books order'
  }, function(err, charge) {
    if (err) {
      console.log('payment failed:', err);
      res.status(400).send('Error');
    }
    else {
      updateUser(req.userId, cart);
      res.status(200).send('OK');
    }
  });
});

module.exports = router;
