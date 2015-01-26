'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports.setup = function (User, config) {
  passport.use(

    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      function (email, password, done) {
        User.findOne({
          $or: [
            {
              email: email.toLowerCase()          
            },
            {
              username: email.toLowerCase()
            }
          ]
        }, function (err, user) {
          if (err) {
            done(err);
            return;
          }

          if (!user) {
            done(null, false, {message: 'This email is not registered.'})
            return;
          }

          if (!user.authenticate(password)) {
            done(null, false, {message: 'This password is not correct.'});
            return;
          }

          done(null, user);
        });
      }
    )
  );
};