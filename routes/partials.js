'use strict';

let express = require('express');
let router = express.Router();

let auth = require('../config/auth');

router.get('/login', (req, res) => {
  res.render('partials/' + 'login');
});

router.get('/register', (req, res) => {
  res.render('partials/' + 'register');
});

router.get('/storefront', (req, res) => {
  res.render('partials/' + 'storefront');
});

router.get('/cart', (req, res) => {
  res.render('partials/' + 'cart');
});

router.get('/:name', auth.isAuth, (req, res) => {
  res.render('partials/' + req.params.name);
});

module.exports = router;
