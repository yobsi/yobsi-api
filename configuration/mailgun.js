'use strict';

var config = require('./environment/index.js');
var api_key = config.mailgun.api_key;
var domain = config.mailgun.domain;
var constants = require('./constants');
var mailgun = require('mailgun-js')({
  apiKey: api_key,
  domain: domain
});

module.exports = {
  sendEmail: sendEmail
};

function sendEmail (to, subject, text, cb) {
  var data = {
    from: constants.USER_FROM_EMAIL,
    to: to,
    subject: subject,
    text: text
  };

  mailgun.messages().send(data, cb);
}