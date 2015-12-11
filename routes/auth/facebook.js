'use strict';

let request = require('request');
let express = require('express');
let router = express.Router();

let User = require('../../models/user');

router.post('/', (req, res) => {
  let accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  let graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=id,email,first_name,last_name,link,name';

  let params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: process.env.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({
    url: accessTokenUrl,
    qs: params,
    json: true
  }, (err, response, accessToken) => {
    if (response.statusCode !== 200) {
      return res.status(500).send({
        message: accessToken.error.message
      });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({
      url: graphApiUrl,
      qs: accessToken,
      json: true
    }, (err, response, profile) => {
      console.log('facebook profile:', profile);
      if (response.statusCode !== 200) {
        return res.status(500).send({
          message: profile.error.message
        });
      }
      if (req.headers.authorization) {
        User.findOne({
          facebook: profile.id
        })
          .populate('cart')
          .exec((err, existingUser) => {
          if (existingUser) {
            return res.status(409).send({
              message: 'There is already a Facebook account that belongs to you'
            });
          }
          let token = req.headers.authorization.split(' ')[1];
          let payload = jwt.decode(token, process.env.JWT_SECRET);
          User.findById(payload.sub)
            .populate('cart')
            .exec((err, user) => {
            if (!user) {
              return res.status(400).send({
                message: 'User not found'
              });
            }
            user.facebook = profile.id;
            user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.displayName = user.displayName || profile.name;
            user.save((err, doc) => {
              if (err) {
                console.log('err: ', err);
              }
              let token = user.token();
            console.log('2 ', token);
              res.send({
                token: token,
                user: user
              });
            });
          });
        });
      }
      else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({
          facebook: profile.id
        })
          .populate('cart')
          .exec((err, existingUser) => {
          if (existingUser) {
            let token = existingUser.token();
            console.log('3 ', token);
            return res.send({
              token: token,
              user: existingUser
            });
          }
          let user = new User();
          user.facebook = profile.id;
          user.email = profile.email;
          user.firstName = profile.first_name;
          user.lastName = profile.last_name;
          user.avatar = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.save((err, doc) => {
            if (err) {
              console.log('err: ', err);
            }
            let token = user.token();
                        console.log('1 ', token);

            res.send({
              token: token,
              user: user
            });
          });
        });
      }
    });
  });
});

module.exports = router;

