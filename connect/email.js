'use strict';

let api_key = process.env.KEY_MAILGUN;
let domain = process.env.DOMAIN_MAILGUN;
let mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

let from = 'Bookstore Manager <postmaster@sandboxc060e4c8d4c24c80b985e612853883ec.mailgun.org>';

module.exports.activate = function(email, token, cb) {
  let data = {
    from: from,
    to: email,
    subject: 'User account activation',
    text: 'Deat Customer\n\
\n\
We sent you this e-mail beacuse someone registered using this address.\n\
if it was you, please go ahead and activate your account here:\n\
\n\
\n\
http://localhost:3000/#/activate/' + token + '\n\
\n\
\n\
Best Regards,\n\
Bookstore Manager\n\
\n'
  };

  mailgun.messages().send(data, (err) => {
    cb(err);
  });
}

module.exports.reset = function(email, password, cb) {
  let data = {
    from: from,
    to: email,
    subject: 'User account activation',
    text: 'Deat Customer\n\
\n\
We have reset your password. Your new password it "' +password+ '"\n\
Good luck shopping with us.\n\
\n\
Best Regards,\n\
Bookstore Manager\n\
\n'
  };

  mailgun.messages().send(data, (err) => {
    cb(err);
  });
}
