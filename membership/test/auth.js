'use strict';

var should = require('should');
var request = require('supertest');
var app = require('../../index.js');
var util = require('./util.js');
var async = require('async');

describe.skip('Auth API Test', function () {

  before(function (done) {
    util.cleanProfessionalsOnDB(done);
  });

  afterEach(function (done) {
    util.cleanProfessionalsOnDB(done)
  });


  it('should create an account for local auth', function (done) {
    request(app)
      .post('/api/professionals')
      .send({
        email: 'ralph@gmail.com',
        username: 'ralph',
        password: 'ralph'
      })
      .end(function (err, res) {
        var token = res.body.token;
        var user = res.body.user;
        console.log(res.body.error);
        should.not.exist(res.body.error);
        should.exist(token);
        should.equal(user.provider, 'local', 'provider should be local');
        done();
      });
  });

  it('should create an account for facebook auth', function (done) {
    request(app)
      .post('/api/professionals')
      .send({
        email: 'ralph@gmail.com',
        username: 'ralph',
        fbId: '234097329048239084'
      })
      .end(function (err, res) {
        var token = res.body.token;
        var user = res.body.user;

        should.not.exist(res.body.error);
        should.exist(token);
        should.equal(user.provider, 'facebook', 'provider should be facebook');
        done();
      });
  });

  it('should authenticate to ralph user by his facebook id', function (done) {
    async.series(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              username: 'ralph',
              fbId: 'weoiruioweurewopruwepo32'
            })
            .end(function (err, res) {
              var user = res.body.user;
              console.log(user);
              should.exist(user);
              next();
            });
        },
        function authenticateUser (next) {
          request(app)
            .post('/auth')
            .send({
              email: 'ralph@gmail.com',
              fbId: 'weoiruioweurewopruwepo32'
            })
            .end(function (err, res) {
              var token = res.body.token;
              var user = res.body.user;

              should.exist(token);
              next();
            });
        }
      ],
      function (err, res) {
        done(err);
      }
    );
  });

  it('should authenticate to ralph user by his password', function (done) {
    async.series(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              username: 'ralph',
              password: 'ralphy'
            })
            .end(function (err, res) {
              var user = res.body.user;
              should.exist(user);
              next();
            });
        },
        function authenticateUser (next) {
          request(app)
            .post('/auth')
            .send({
              password: 'ralphy',
              username: 'ralph',
              email: 'ralph@gmail.com'
            })
            .end(function (err, res) {
              var token = res.body.token;
              var user = res.body.user;

              should.exist(token);
              next();
            });
        }
      ],
      function (err, res) {
        done(err);
      }
    );
  });

  it('should authenticate to ralph user by his only password and email', function (done) {
    async.series(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              username: 'ralph',
              password: 'ralphy'
            })
            .end(function (err, res) {
              var user = res.body.user;
              should.exist(user);
              next();
            });
        },
        function authenticateUser (next) {
          request(app)
            .post('/auth')
            .send({
              password: 'ralphy',
              email: 'ralph@gmail.com'
            })
            .end(function (err, res) {
              var token = res.body.token;
              var user = res.body.user;

              should.exist(token);
              next();
            });
        }
      ],
      function (err, res) {
        done(err);
      }
    );
  });

  it('should authenticate to ralph user by his only password and username', function (done) {
    async.series(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              username: 'ralph',
              password: 'ralphy'
            })
            .end(function (err, res) {
              var user = res.body.user;
              should.exist(user);
              next();
            });
        },
        function authenticateUser (next) {
          request(app)
            .post('/auth')
            .send({
              password: 'ralphy',
              username: 'ralph',
            })
            .end(function (err, res) {
              var token = res.body.token;
              var user = res.body.user;

              should.exist(token);
              next();
            });
        }
      ],
      function (err, res) {
        done(err);
      }
    );
  });

  it('should not authenticate to ralph user because password invalid sent', function (done) {
    async.series(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy',
              username: 'ralph'
            })
            .end(function (err, res) {
              next();
            });
        },

        function authUser (next) {
          request(app)
            .post('/auth')
            .send({
              email: 'ralph@gmail.com',
              password: 'passwordinvalid'
            })
            .end(function (err, res) {
              console.log(res.body.error);
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

  it('should not authenticate to ralph user because username invalid sent', function (done) {
    async.series(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy',
              username: 'ralph'
            })
            .end(function (err, res) {
              next();
            });
        },

        function authUser (next) {
          request(app)
            .post('/auth')
            .send({
              username: 'invalidusername',
              password: 'ralphy'
            })
            .end(function (err, res) {
              console.log(res.body.error);
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

  it('should not authenticate to ralph user because email invalid sent', function (done) {
    async.series(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy',
              username: 'ralph'
            })
            .end(function (err, res) {
              next();
            });
        },

        function authUser (next) {
          request(app)
            .post('/auth')
            .send({
              email: 'invalid@gmail.com',
              password: 'ralphy'
            })
            .end(function (err, res) {
              console.log(res.body.error);
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

  it('should not authenticate to ralph user because facebook id is invalid', function (done) {
    async.series(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy',
              username: 'ralph',
              fbId: '32o4khsdflshdfjkjkl'
            })
            .end(function (err, res) {
              next();
            });
        },

        function authUser (next) {
          request(app)
            .post('/auth')
            .send({
              fbId: 'invalidfacebookid',
            })
            .end(function (err, res) {
              console.log('LET IT GO');
              console.log(res.body);
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

  it('should not authenticate to ralph user because password is empty', function (done) {
    async.series(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy',
              username: 'ralph',
              fbId: '32o4khsdflshdfjkjkl'
            })
            .end(function (err, res) {
              next();
            });
        },

        function authUser (next) {
          request(app)
            .post('/auth')
            .send({
              username: '',
              password: ''
            })
            .end(function (err, res) {
              console.log(res.body);
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

  it('should not authenticate to ralph user because email is empty', function (done) {
    async.series(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy',
              username: 'ralph'
            })
            .end(function (err, res) {
              next();
            });
        },

        function authUser (next) {
          request(app)
            .post('/auth')
            .send({
              email: '',
              password: 'ralphy'
            })
            .end(function (err, res) {
              console.log(res.body);
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

  it('should not authenticate to ralph user because facebook id is empty', function (done) {
    async.series(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy',
              username: 'ralph',
              fbId: 'w874ohjsdfjsdlkfj'
            })
            .end(function (err, res) {
              next();
            });
        },

        function authUser (next) {
          request(app)
            .post('/auth')
            .send({
              fbId: ''
            })
            .end(function (err, res) {
              console.log(res.body);
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

  it('should not authenticate to ralph user because username is empty', function (done) {
    async.series(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy',
              username: 'ralph'
            })
            .end(function (err, res) {
              next();
            });
        },

        function authUser (next) {
          request(app)
            .post('/auth')
            .send({
              username: '',
              password: 'ralphy'
            })
            .end(function (err, res) {
              console.log(res.body);
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

  it('should not create a user because email was already created by facebook auth', function (done) {
    async.series(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy',
              username: 'ralph',
              fbId: '1234567890'
            })
            .end(function (err, res) {
              next();
            });
        },

        function createUser2 (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              username: 'ralph',
              password: 'ralphy'
            })
            .end(function (err, res) {
              console.log(res.body.error);
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

  it('should create a user even creating a facebook auth', function (done) {
    async.series(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph2@gmail.com',
              password: 'ralphy',
              username: 'ralph',
              fbId: '1234567890'
            })
            .end(function (err, res) {
              next();
            });
        },

        function createUser2 (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              username: 'ralph',
              password: 'ralphy'
            })
            .end(function (err, res) {
              should.not.exist(res.body.error);
              next();
            });
        }
      ],
      function (err, res) {
        done(err);
      }
    );
  });

  it('should let user by facebook sign up because username was already created by local registering', function (done) {
    async.series(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph2@gmail.com',
              password: 'ralphy',
              username: 'ralph'
            })
            .end(function (err, res) {
              next();
            });
        },

        function createUser2 (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              username: 'ralph',
              password: 'ralphy',
              fbId: '1234567890'
            })
            .end(function (err, res) {
              should.not.exist(res.body.error);
              next();
            });
        }
      ],
      function (err, res) {
        done(err);
      }
    );
  });

  it('should not create a user by facebook sign up because email was already created by local registering', function (done) {
    async.series(
      [
        function createUser (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              password: 'ralphy',
              username: 'ralph1'
            })
            .end(function (err, res) {
              next();
            });
        },

        function createUser2 (next) {
          request(app)
            .post('/api/professionals')
            .send({
              email: 'ralph@gmail.com',
              fbId: '1234567890'
            })
            .end(function (err, res) {
              console.log(res.body.error);
              should.not.exist(res.body.error);
              should.exist(res.body.user);
              next();
            });
        }
      ],
      function (err, res) {
        done(err);
      }
    );
  });
});


