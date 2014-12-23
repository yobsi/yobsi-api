'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../../configuration/environment/index.js');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../professional/professional.model.js');
var validateJwt = expressJwt({secret: config.secrets.session});

function isAuthenticated () {
  return compose()
    .use(function (req, res, next) {
      validateJwt(req, res, next);
    })
    .use(function (req, res, next) {
      User.findById(req.user._id, function (err, user) {
        if (err) {
          next(err);
          return;
        }

        if (!user) {
          res.send(401);
          return;
        }

        req.user = user;
        next();
      });
    });
}

function signToken (id) {
  return jwt.sign(
    {
      _id: id
    },
    config.secrets.session,
    {
      expireInMinutes: 60*5;
    }
  );
}

module.exports = {
  isAuthenticated: isAuthenticated,
  signToken: signToken
};