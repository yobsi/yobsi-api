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

  it('should not be able to use /me because token invalid', function (done) {
    request(app)
      .get('/api/professionals/me')
      .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NDliMTFkNTU0NTExYmY0MTk5ZTM5NDIiLCJpYXQiOjE0MTk0NDg3OTB9.6DaSb0K9TH8LuDCAdDSCJ_YnEtNmAJkdxgFh1yvZXE0')
      .end(function (err, res) {
        res.status.should.not.equal(200);
        done();
      });
  });

  it('should consume /me', function (done) {
    var body = {
      name: 'Wilson Balderrama',
      email: 'wilson.balderrama@gmail.com',
      password: 'sesamo'
    };
    var token;

    async.series(
      [
        function createUser (next) {
          util.createUser(app, body, function (err, res) {
            next();
          });
        },
        function authenticateUser (next) {
          util.authenticateUser(app, body, function (err, res) {
            res.body.token.should.exist;
            token = res.body.token;
            next();
          });
        },
        function consumeMeRoute (next) {
          request(app)
            .get('/api/professionals/me')
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res) {
              res.status.should.equal(200);
              done();
            });
        }
      ],
      function (err, res) {
        err.should.exist;
        done();
      }
    );
  });


  it('should not create a new user because he exists', function (done) {
    var body = {
      name: 'Wilson Balderrama',
      email: 'wilson.balderrama@gmail.com',
      password: 'sesamo'
    };

    async.series(
      [
        function createUser (next) {
          util.createUser(app, body, function (err, res) {
            next();
          });
        },
        function tryToCreateSameUser (next) {
          util.createUser(app, body, function (err, res) {
            next(res.error);
          });
        }
      ],
      function (err, res) {
        err.should.exist;
        done();
      }
    );
  });

  it('should update a user');

  it('should not create a user because data sent is invalid', function (done) {
    util.createUser(app, {}, function (err, res) {
      res.error.should.exist;
      done();
    });
  });

  it('should create a new user', function (done) {
    util.createUser(
        app, 
        {
          name: 'Wilson Balderrama',
          email: 'wilson.balderrama@gmail.com',
          password: 'sesamo'
        },
        function (err, res) {
          res.error.should.not.exist;
          res.status.should.equal(200);
          res.body.token.should.exist;
          done();
        }
      );
  });
});