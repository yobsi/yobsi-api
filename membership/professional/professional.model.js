'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var UserSchema = new Schema({
  name: String,
  email: {type: String, lowercase: true},
  hashedPassword: String,
  provider: String,
  salt: String,
  facebook: {

  }
});


UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });


UserSchema
  .path('email')
  .validate(function (email) {
    if (this.provider !== 'local') {
      return true;
    }

    return email.length;
  }, 'Email cannot be empty.');

UserSchema
  .path('email')
  .validate(function (value, respond) {
    var self = this;

    this.constructor.findOne({email: value}, function (err, user) {
      if (err) {
        throw err;
      }

      if (user) {
        if (self.id === user.id) {
          respond(true);
          return;
        }
        respond(false);
        return;
      }

      respond(true);
    });
  }, 'The specified email address is already in use.');

UserSchema
  .path('hashedPassword')
  .validate(function (hashedPassword) {
    if (this.provider !== 'local') {
      return true;
    }

    return hashedPassword.length;
  }, 'Password cannot be blank.');


UserSchema
  .pre('save', function (next) {
    if (!this.isNew) {
      next();
      return;
    }

    if (!validatePresenceOf(this.hashedPassword) && this.provider === 'local') {
      next(new Error('Invalid password'));
      return;
    } 

    next();
  });

UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },
  encryptPassword: function (password) {
    var salt;

    if (!password || !this.salt) {
      return '';
    }

    salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('Professional', UserSchema);





