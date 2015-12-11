'use strict';

let express = require('express');
let router = express.Router();

let User = require('../models/user');
let auth = require('../config/auth');

let checkError = (err, res, user) => {
  if (err) {
    console.log('err: ', err);
    res.status(400).send(err);
  }
  else {
    res.json(user);
  }
}

// user registration
router.post('/register', (req, res) => {
  console.log(req.body);
  User.findOne({email: req.body.email}, (err, user) => {
    if (err) {
      checkError(err, res);
    }
    else if (user !== null) {
      res.status(409).send('User already exists');
    }
    else {
      let user = new User(req.body);
      user.encryptPass((err) => {
        if (err) {
          console.log(err);
          res.status(500).send('Encryption failed');
        }
        else {
          user.save((err, doc) => {
            if (!err) {
              doc.password = null;
            }
            checkError(err, res, doc);
          });
        }
      });
    }
  });
});

// User authentication
router.post('/authenticate', (req, res) => {
  console.log('Authenticating', req.body.email);
  User.findOne({email: req.body.email})
    .populate('cart')
    .exec((err, doc) => {
    if (err) {
      console.error('Database error: ', err);
      res.status(500).send();
    }
    else if (doc === null) {
      console.log('Not Authenticated.');
      res.status(401).send();
    }
    else {
      doc.validatePass(req.body.password, (err, result) => {
        if (err || !result) {
          console.log('Not Authenticated.', err);
          res.status(401).send();
        }
        else {
          let token = doc.token();
          if (token) {
            res.send({token: token, user: doc});
          }
          else {
            res.status(500).send();
          }
        }
      });
    }
  });
});

// the user may request their details
router.get('/me', auth.isAuth, (req, res) => {
  let id = req.userId;
  User.findOne({_id: id})
    .populate('cart')
    .exec((err, user) => {
    if (err) {
      checkError(err, res);
    }
    else if (!user) {
      res.status(401).send('Authentication error');
    } 
    else {
      user.password = null;
      res.json(user);
    }
  });
});

// the user may update their record
router.put('/me', auth.isAuth, (req, res) => {
  let user = new User(req.body);
  user._id = req.userId;
  console.log(user);
  if (!user.password) {
    User.findOneAndUpdate({_id: req.userId}, user, {new: true}, (err, doc) => {
      if (err) {
        checkError(err, res);
      }
      else {
        doc.password = null;
        res.json(doc);
      }
    });
  }
  else {
    user.encryptPass((err) => {
      if (err) {
        checkError(err, res);
      }
      else {
        User.findOneAndUpdate({_id: req.userId}, user, {new: true}, (err, doc) => {
          if (err) {
            checkError(err, res);
          }
          else {
            doc.password = null;
            res.json(doc);
          }
        });
      }
    });
  }
});

// the user may add books to cart
router.put('/add-to-cart/:bookId', auth.isAuth, (req, res) => {
  User.findOneAndUpdate({_id: req.userId},
   { $push: { cart: req.params.bookId } },
   {new: true}, (err, doc) => {
    if (err) {
      checkError(err, res);
    }
    else {
      res.json(doc);
    }
  });
});

// the user may delete books from cart
router.delete('/remove-from-cart/:bookId', auth.isAuth, (req, res) => {
  User.findOneAndUpdate({_id: req.userId},
   { $pull: { cart: req.params.bookId } },
   {new: true})
    .populate('cart')
    .exec((err, doc) => {
    if (err) {
      checkError(err, res);
    }
    else {
      res.json(doc);
    }
  });
});

module.exports = router;
