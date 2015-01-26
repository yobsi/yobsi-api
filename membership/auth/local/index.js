'use strict';

var passport =  require('passport');
var auth = require('../auth.service.js');
var logger = require('../../../configuration/logger.js');

module.exports = function (req, res, next) {

  req.body.email = req.body.email || req.body.username;

  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    var token;

    if (error) {
      res.status(401).json({error: error.toString()});
      return;
    }

    if (!user) {
      res.status(404).json({error: 'User not found.'});
      return;
    }

    token = auth.signToken(user._id);
    res.json({token: token, user: user});
  })(req, res, next);
};