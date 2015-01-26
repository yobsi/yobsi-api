'use strict';

var auth = require('../auth.service.js');
var logger = require('../../../configuration/logger.js');
var User = require('../../professional/professional.model.js');

module.exports = function (req , res, next) {

  User.findOne({
    'facebook.id': req.body.fbId
  }, function (err, user) {
    var token;

    if (err) {
      res.status(500).json({
        error: err.toString()
      });
      return;
    }

    if (!user) {
      var error = new Error('User not found.');
      logger.log('error', error.toString());
      res.status(404).json({error: error.toString()});
      return;
    }

    token = auth.signToken(user._id);
    res.json({token: token, user: user});
  });

};