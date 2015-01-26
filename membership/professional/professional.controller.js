'use strict';

var User = require('./professional.model.js');
var passport = require('passport');
var config = require('../../configuration/environment/index.js');
var auth = require('../auth/auth.service.js');
var async = require('async');
var constants = require('../../configuration/constants.js');
var mailgun = require('../../configuration/mailgun.js');

module.exports = {
  create: create,
  me: me,
  sendLinkResetPasswordEmail: sendLinkResetPasswordEmail,
  resetPassword: resetPassword
};

var validationError = function (res, err) {
  return res.status(422).json(err);
};

function create (req, res, next) {
  var newProfessional = new User(req.body);
  var fbId = req.body.fbId;
  var email = req.body.email;

  if (fbId) {
    async.series(
      [
        function searchForUser (next) {
          existUser(email, fbId, function (err, user) {
            var token, result;

            if (user) {
              token = auth.signToken(user._id);
              result = {token: token, user: user};
              res.status(200).json(result);
              return;
            }

            next();
          });
        },

        function insertUser (next) {
          User.create({
            email: email,
            'facebook.id': fbId,
            provider: 'facebook'
          }, function (err, user) {
            var token, result;

            if (err) {
              res.status(404).json({
                error: err.toString()
              });
              return;
            }

            if (!user) {
              res.status(404).json({
                error: 'User not found'
              });
              return;
            }

            token = auth.signToken(user._id);
            result = {token: token, user: user};
            res.json(result);
          });
        }
      ]
    );
  } else {
    newProfessional.provider = 'local';
    newProfessional.save(function (err, user) {
      var token, result;

      if (err) {
        res.status(422).json({
          error: err.toString()
        });
        return;
      }

      token = auth.signToken(user._id);
      result = {token: token, user: user};
      res.json(result);
    });
  }
}

function me (req, res, next) {
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

function resetPassword (req, res, next) {
  var newPassword = req.body.newPassword;
  var userId = req.params.userId;

  if (!newPassword || newPassword.length < 6) {
    res.status(400).json({error: 'Password empty or it is less than six characters.'});
    return;
  }

  async.waterfall(
    [
      function getUser (next) {
        console.log('userId: ');
        console.log(userId);
        User.findOne({
          _id: userId
        }, function (err, user) {
          var error;

          if (err) {
            next(err);
            return;
          }

          if (!user) {
            error = new Error('User not found.');
            next(error);
            return;
          }

          user.salt = user.makeSalt();
          user.hashedPassword = user.encryptPassword(newPassword);
          next(null, user);
        });
      },
      function updateUserPassword (user, next) {
        User.update({
          _id: user._id
        }, {
          salt: user.salt,
          hashedPassword: user.hashedPassword
        }, function (err, numberAffected) {
          var error;

          if (numberAffected <= 0) {
            error = new Error('User password was not updated.');
            next(error);
            return;
          }

          next(err, user);
        });
      }
    ],
    function (err, user) {
      console.log(err);
      if (err) {
        res.status(400).json({error: err.toString()});
        return;
      }

      res.status(200).json({message: 'User password was updated successfully.', user: user});
    }
  );
}

function sendLinkResetPasswordEmail (req, res, next) {
  var linkToSend;

  async.waterfall(
    [
      function findUser (next) {
        User.findOne({
          $or: [
            {
              email: req.params.username
            },
            {
              username: req.params.username
            }
          ]
        }, function (err, user) {
          var error;

          if (err) {
            next(err);
            return;
          }

          if (!user) {
            error = new Error('User not found.');
            next(error);
            return;
          }

          next(null, user.email, user._id);
        });
      },

      function sendLinkToEmail (email, userId, next) {
        sendResetPasswordLinkTo(email, userId, function (err, body) {
          if (err) {
            next(err);
            return;
          }

          next();
        });
      }
    ],
    function (err, result) {
      console.log('WHAT !!!!!');
      if (err) {
        res.status(400).json({error: err.toString()});
        return;
      }

      res.json({message: 'The reset password email was already sent!'});
    }
  );
}

function sendResetPasswordLinkTo (to, userId, cb) {
  var subject = constants.SUBJECT_EMAIL_FORGOT_PASSWORD;
  var body = generateBodyPasswordLink(userId);

  mailgun.sendEmail(to, subject, body, cb);
}

function generateBodyPasswordLink (userId) {
  var body = constants.BODY_EMAIL_FORGOT_PASSWORD;
  var link = generateResetPasswordLink(userId);

  body += '\n';
  body += link;

  return body;
}

function generateResetPasswordLink (userId) {
  return constants.EXCLUSR_LINK_FORGOT_PASSWORD + userId + '-' + auth.signToken(userId);
}

function existUser (email, fbId, cb) {
  User.findOne({
    $or: [
      {
        email: email
      },
      {
        'facebook.id': fbId
      }
    ]
  }, cb);
}
















