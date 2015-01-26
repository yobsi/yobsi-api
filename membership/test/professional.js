'use strict';

var should = require('should');
var request = require('supertest');
var app = require('../../index.js');
var async = require('async');
var util = require('./util.js');

describe.skip('Professional API Test', function () {

  before(function (done) {
    util.cleanProfessionalsOnDB(done);
  });

  afterEach(function (done) {
    util.cleanProfessionalsOnDB(done);
  });

  it('should return 200 status code when calling to reset password', function (done) {
    async.waterfall(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'wilson.balderrama@gmail.com',
              password: 'ralphy'
            })
            .end(function (err, res) {
              var token = res.body.token;
              should.exist(token);
              next(err, token);
            });
        },
        function sendLink (token, next) {
          request(app)
            .post('/api/professionals/wilson.balderrama@gmail.com/reset-password')
            .expect(200)
            .end(function (err, res) {
              next(err);
            });
        }
      ],
      function (err, res) {
        done(err);
      }
    );
  });

  it('should return 404 because email sent does not exist', function (done) {
    async.waterfall(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy'
            })
            .expect(200)
            .end(function (err, res) {
              next(err);
            });
        },
        function authUser (next) {
          request(app)
            .post('/auth')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy'
            })
            .expect(200)
            .end(function (err, res) {
              console.log(err);
              next(err, res.body.token);
            });
        },
        function resetPass (token, next) {
          request(app)
            .post('/api/professionals/ralph1@gmail.com/reset-password')
            .expect(400, next);
        }
      ],
      function (err, res) {
        done(err);
      }
    );
  });

  it('should return 404 because username sent does not exist', function (done) {
    async.waterfall(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy'
            })
            .expect(200)
            .end(function (err, res) {
              next(err);
            });
        },
        function authUser (next) {
          request(app)
            .post('/auth')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy'
            })
            .expect(200)
            .end(function (err, res) {
              console.log(err);
              next(err, res.body.token);
            });
        },
        function sendLink (token, next) {
          request(app)
            .post('/api/professionals/username/reset-password')
            .expect(400, next);
        }
      ],
      function (err, res) {
        done(err);
      }
    );
  });

  it('should return 200 status code because a user could change his password.', function (done) {
    async.waterfall(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy'
            })
            .expect(200)
            .end(function (err, res) {
              var user = res.body.user;

              should.exist(user);

              next(err, user);
            });
        },
        function authUser (user, next) {
          request(app)
            .post('/auth')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy'
            })
            .expect(200)
            .end(function (err, res) {
              var token = res.body.token;

              should.exist(token);
              should.exist(user);

              next(err, user._id, token);
            });
        },
        function resetPassword (userId, token, next) {
          request(app)
            .put('/api/professionals/' + userId + '/attributes/password')
            .send({
              newPassword: 'ralph12345'
            })
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function (err, res) {
              var message = res.body.message;
              var user = res.body.user;

              should.exist(message, 'expected that message exist');
              should.exist(user);

              next(err);
            });
        }
      ],
      function (err, res) {
        should.not.exist(err);
        done(err);
      }
    );
  });

  it('should return 400 status code because a user did not send the password.', function (done) {
    async.waterfall(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy'
            })
            .expect(200)
            .end(function (err, res) {
              next(err);
            });
        },
        function authUser (next) {
          request(app)
            .post('/auth')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy'
            })
            .expect(200)
            .end(function (err, res) {
              var token = res.body.token;
              should.exist(token);
              next(err, token);
            });
        },
        function resetPassword (token, next) {
          request(app)
            .put('/api/professionals/ralph@gmail.com/attributes/password')
            .send({
              // newPassword: 'ralph'
            })
            .set('Authorization', 'Bearer ' + token)
            .expect(400)
            .end(function (err, res) {
              var message = res.body.message;
              var user = res.body.user;

              should.not.exist(message);
              should.not.exist(user);
              should.exist(res.body.error);
              next();
            });
        }
      ],
      function (err, res) {
        done(err);
      }
    );
  });

  it('should return 404 status code because a user sent a password empty.', function (done) {
    async.waterfall(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy'
            })
            .expect(200)
            .end(function (err, res) {
              var user = res.body.user;
              should.exist(user);
              next(err, user);
            });
        },
        function authUser (user, next) {
          request(app)
            .post('/auth')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy'
            })
            .expect(200)
            .end(function (err, res) {
              var token = res.body.token;
              should.exist(token);
              next(err, user, token);
            });
        },
        function resetPassword (user, token, next) {
          request(app)
            .put('/api/professionals/'+user._id+'/attributes/password')
            .send({
              newPassword: '2d'
            })
            .set('Authorization', 'Bearer ' + token)
            .expect(400)
            .end(function (err, res) {
              var message = res.body.message;
              var user = res.body.user;

              should.not.exist(message);
              should.not.exist(user);

              next(err);
            });
        }
      ],
      function (err, res) {
        done(err);
      }
    );
  });

  it('should return 404 status code because a user not found', function (done) {
    async.waterfall(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy'
            })
            .expect(200)
            .end(function (err, res) {
              var user = res.body.user;
              should.exist(user);
              next(err, user);
            });
        },
        function authUser (user, next) {
          request(app)
            .post('/auth')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy'
            })
            .expect(200)
            .end(function (err, res) {
              var token = res.body.token;
              should.exist(token);
              next(err, user, token);
            });
        },
        function resetPassword (user, token, next) {
          request(app)
            .put('/api/professionals/sdfdsf/attributes/password')
            .send({
              newPassword: '9s87fsdhfiosdif'
            })
            .set('Authorization', 'Bearer ' + token)
            .expect(400)
            .end(function (err, res) {
              var message = res.body.message;
              var user = res.body.user;

              should.not.exist(message);
              should.not.exist(user);

              next(err);
            });
        }
      ],
      function (err, res) {
        done(err);
      }
    );
  });

  it('should return 200 status code because he could change his password and now he is logging in with his new password', function (done) {
    var newPassword = 'myNewPassword';

    async.waterfall(
      [
        function createUser(next) {
          request(app)
            .post('/api/professionals')
            .send({
              username: 'wilsonbalderrama',
              email: 'wilson@gmail.com',
              password: 'ralphy'
            })
            .end(function (err, res) {
              var token = res.body.token;
              var user = res.body.user;
              should.exist(user);
              should.exist(token);
              next(err, user._id, token);
            });
        },

        function resetPassword (userId, token, next) {
          request(app)
            .put('/api/professionals/' + userId + '/attributes/password')
            .set('Authorization', 'Bearer ' + token)
            .send({
              newPassword: 'newRalphy'
            })
            .expect(200)
            .end(function (err, res) {
              should.not.exist(res.body.error);
              should.exist(token);
              next(err, token);
            });
        },

        function authUserWithNewPassword (token, next) {
          request(app)
            .post('/auth')
            .set('Authorization', 'Bearer ' + token)
            .send({
              username: 'wilsonbalderrama',
              password: 'newRalphy'
            })
            .expect(200)
            .end(function (err, res) {
              next(err);
            });
        }

      ],
      function (err, res) {
        done(err);
      }
    );
  });

  it('should return 200 status code because user had created a account with facebook and now he is again using auth facebook', function (done) {
    async.waterfall(
      [
        function createUserUsingFacebook (next) {
          request(app)
            .post('/api/professionals')
            .send({
              fbId: 'wi7w8yhdsifhsdil',
              email: 'ralph@gmail.com'
            })
            .expect(200)
            .end(function (err, result) {
              next();
            });
        },

        function authUserWithFacebook (next) {
          request(app)
            .post('/api/professionals')
            .send({
              fbId: 'wi7w8yhdsifhsdil',
              email: 'ralph@gmail.com'
            })
            .expect(200)
            .end(function (err, result) {
              next();
            });

        }
      ],
      function (err, result) {
        done();
      }
    );
  });
});