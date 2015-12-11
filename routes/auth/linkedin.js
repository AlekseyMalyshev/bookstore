'use strict';

let request = require('request');
let express = require('express');
let router = express.Router();

let User = require('../../models/user');

router.post('/', (req, res) => {
  let accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
  let peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
  let params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: process.env.LINKEDIN_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, {
    form: params,
    json: true
  }, (err, response, body) => {
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).send({
        message: body.error_description
      });
    }
    let params = {
      oauth2_access_token: body.access_token,
      format: 'json'
    };

    // Step 2. Retrieve profile information about the current user.
    request.get({
      url: peopleApiUrl,
      qs: params,
      json: true
    }, (err, response, profile) => {

      // Step 3a. Link user accounts.
      if (req.headers.authorization) {
        User.findOne({
          linkedin: profile.id
        })
          .populate('cart')
          .exec((err, existingUser) => {
          if (existingUser) {
            return res.status(409).send({
              message: 'There is already a LinkedIn account that belongs to you'
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
            user.linkedin = profile.id;
            user.email = profile.emailAddress;
            user.firstName = profile.firstName;
            user.lastName = profile.lastName;
            user.avatar = profile.pictureUrl;
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
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({linkedin: profile.id})
          .populate('cart')
          .exec((err, existingUser) => {
          if (existingUser) {
            return res.send({
              token: existingUser.token(),
              user: existingUser
            });
          }
          let user = new User();
          user.linkedin = profile.id;
          user.email = profile.emailAddress;
          user.firstName = profile.firstName;
          user.lastName = profile.lastName;
          user.avatar = profile.pictureUrl;
          user.save((err, doc) => {
            console.log('err: ', err);
            res.send({
              token: user.token(),
              user: user
            });
          });
        });
      }
    });
  });
});

module.exports = router;

