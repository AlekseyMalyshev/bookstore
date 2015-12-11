'use strict';

let jwt = require('jsonwebtoken');

let User = require('../models/user');

module.exports.auth = (req, res, next) => {
  let token = req.header('Authorization');
  if (!token || token.indexOf('Bearer ') !== 0) {
    next();
  }
  else {
    jwt.verify(token.substring(7), process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.userId = decoded._id;
        req.userName = decoded.name;
      }
      next();
    });
  }
}

module.exports.isAuth = (req, res, next) => {
  if (!req.userId) {
    res.status(401).send('Unauthorised');
  }
  else {
    next();
  }
}
