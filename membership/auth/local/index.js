'use strict';

var express = require('express');
var passport =  require('passport');
var auth = require('../auth.service.js');

var router = express.Router();

router.post('/', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    var token;

    if (error) {
      res.json(401, error);
      return;
    }

    if (!user) {
      res.json(404, {message: 'Something went wrong, please try again.'});
      return;
    }

    token = auth.signToken(user._id);
    res.json({token: token});
  })(req, res, next);
});

module.exports = router;