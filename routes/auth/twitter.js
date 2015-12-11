'use strict';

let qs = require('querystring');
let request = require('request');
let express = require('express');
let router = express.Router();

let User = require('../../models/user');

router.post('/', (req, res) => {
  let requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  let accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  let profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

  // Part 1 of 2: Initial request from Satellizer.
  if (!req.body.oauth_token || !req.body.oauth_verifier) {
    let requestTokenOauth = {
      consumer_key: process.env.TWITTER_KEY,
      consumer_secret: process.env.TWITTER_SECRET,
      callback: req.body.redirectUri
    };

    // Step 1. Obtain request token for the authorization popup.
    request.post({
      url: requestTokenUrl,
      oauth: requestTokenOauth
    }, function(err, response, body) {
      let oauthToken = qs.parse(body);

      // Step 2. Send OAuth token back to open the authorization screen.
      res.send(oauthToken);
    });
  }
  else {
    // Part 2 of 2: Second request after Authorize app is clicked.
    let accessTokenOauth = {
      consumer_key: process.env.TWITTER_KEY,
      consumer_secret: process.env.TWITTER_SECRET,
      token: req.body.oauth_token,
      verifier: req.body.oauth_verifier
    };

    // Step 3. Exchange oauth token and oauth verifier for access token.
    request.post({
      url: accessTokenUrl,
      oauth: accessTokenOauth
    }, function(err, response, accessToken) {

      accessToken = qs.parse(accessToken);

      let profileOauth = {
        consumer_key: process.env.TWITTER_KEY,
        consumer_secret: process.env.TWITTER_SECRET,
        oauth_token: accessToken.oauth_token
      };

      // Step 4. Retrieve profile information about the current user.
      request.get({
        url: profileUrl + accessToken.screen_name,
        oauth: profileOauth,
        json: true
      }, (err, response, profile) => {

        // Step 5a. Link user accounts.
        if (req.headers.authorization) {
          User.findOne({
            twitter: profile.id
          })
            .populate('cart')
            .exec((err, existingUser) => {
            if (existingUser) {
              return res.status(409).send({
                message: 'There is already a Twitter account that belongs to you'
              });
            }

            let token = req.headers.authorization.split(' ')[1];
            let payload = jwt.decode(token, process.env.TOKEN_SECRET);

            User.findById(payload.sub)
              .populate('cart')
              .exec((err, user) => {
              if (!user) {
                return res.status(400).send({
                  message: 'User not found'
                });
              }
              user.twitter = profile.id;
              var names = profile.name.split(' ');
              user.firstName = names[0];
              user.lastName = names[1];
              user.avatar = profile.profile_image_url.replace('_normal', '');
              user.save((err, doc) => {
                if (err) {
                  console.log('err: ', err);
                }
                res.send({
                  token: user.token(),
                  user: user
                });
              });
            });
          });
        }
        else {
          // Step 5b. Create a new user account or return an existing one.
          User.findOne({
            twitter: profile.id
          })
            .populate('cart')
            .exec((err, existingUser) => {
            if (existingUser) {
              return res.send({
                token: existingUser.token(),
                user: existingUser
              });
            }

            let user = new User();
            user.twitter = profile.id;
            var names = profile.name.split(' ');
            user.firstName = names[0];
            user.lastName = names[1];
            user.avatar = profile.profile_image_url.replace('_normal', '');
            user.save((err, doc) => {
              if (err) {
                console.log('err: ', err);
              }
              res.send({
                token: user.token(),
                user: user
              });
            });
          });
        }
      });
    });
  }
});

module.exports = router;

