
'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

let Schema = mongoose.Schema;

let userSchema = mongoose.Schema({
    // local login
    password: String,
    // Social networks
    facebook: String,
    twitter: String,
    linkedin: String,
    // Personal details
    email: {type: String, index: { unique: true }},
    firstName: String,
    lastName: String,
    address: String,
    zipcode: String,
    phone: String,
    city: String,
    state: String,
    avatar: String,
    cart: [{type: Schema.Types.ObjectId, ref: 'books'}],
    orders: [{
      book: {type: Schema.Types.ObjectId, ref: 'books'},
      quantity: {type: Number, required: true},
      updated: {type: Date, default: Date.now}
    }],
    updated: {type: Date, default: Date.now},
  });

userSchema.methods.encryptPass = function(cb) {
  bcrypt.genSalt(10, (err1, salt) => {
    bcrypt.hash(this.password, salt, (err2, hash) => {
      if (err1 || err2) {
        cb(err1 || err2);
      }
      else {
        this.password = hash;
        cb(null);
      }
    });
  });
}

userSchema.methods.validatePass = function(password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    if (!err && result) {
      cb(err, this);
    }
    else {
      cb('invalid credentials');
    }
  });
}

userSchema.methods.token = function() {
  let payload = {
    _id: this._id,
    name: this.firstName
  };
  let secret = process.env.JWT_SECRET;
  let token = jwt.sign(payload, secret);

  return token;
}

module.exports = mongoose.model('users', userSchema);
