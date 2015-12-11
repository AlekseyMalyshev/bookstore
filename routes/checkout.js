'use strict';

var express = require('express');
var router = express.Router();

var stripe = require("stripe")(process.env.STRIPE_SECRET);

router.post('/', function(req, res) {

  console.log(req.body);

  var tokenObj = req.body.token;
  var price = req.body.price;

  var charge = stripe.charges.create({
    amount: Math.round(price * 100),
    currency: "USD",
    source: tokenObj.id,
    description: 'Books order'
  }, function(err, charge) {
    if (err) {
      console.log('payment failed:', err);
      res.status(400).send('Error');
    }
    else {
      res.status(200).send('OK');
    }
  });
});

module.exports = router;
