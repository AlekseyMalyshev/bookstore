'use strict';

let twilio = require('twilio');
 
let client = new twilio.RestClient(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN);
 
module.exports.reset = function (phone, password, cb) {
    client.sms.messages.create({
        to: phone,
        from: '+19094734679',
        body: 'You have requested password reset. Your new password is: ' + password
    }, (err, msg) => {
        if (!err) {
            console.log('Success! The SID for this SMS msg is:');
            console.log(msg.sid);
     
            console.log('Message sent on:');
            console.log(msg.dateCreated);
        } else {
            console.log('Oops! There was an err.');
        }
        cb(err);
    });
}
