'use strict';

var User = require('./professional.model.js');
var passport = require('passport');
var config = require('../../configuration/environment/index.js');
var auth = require('../auth/auth.service.js');

var validationError = function (res, err) {
  return res.status(422).json(err);
};

module.exports.searchFor = function (req, res) {
  User
    .find({
      skills: {
        $in: req.query.skillsRequired
      }
    })
    .limit()
    .exec(function (err, professionals) {
      if (err) {
        res.status(400).json({error: err.toString()});
        return;
      }

      res.json(professionals || []);
    });

}

module.exports.create = function (req, res, next) {
  var newProfessional = new User(req.body);

  newProfessional.provider = 'local';

  newProfessional.save(function (err, user) {
    var token;

    if (err) {
      validationError(res, err);
      return;
    }

    token = auth.signToken(user._id);
    res.json({token: token});
  });
};

module.exports.me = function (req, res, next) {
  console.log('hey hey ');
  var userId = req.user._id;

  User.findOne({_id: userId}, '-salt -hashedPassword', function (err, user) {
    if (err) {
      next(err);
      return;
    }

    if (!user) {
      res.json(401);
      return;
    }

    res.json(user);
  });
};