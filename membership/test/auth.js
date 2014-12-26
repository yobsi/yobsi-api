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


  it('should not authenticate because data sent invalid', function (done) {
    request(app)
      .post('/auth/local')
      .send({
        email: 'notexist@gmail.com',
        password: 'whatever'
      })
      .end(function (err, res) {
        should.exist(res.error);              
        done();
      });
  });

  it('should authenticate', function (done) {
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
            res.status.should.equal(200);
            next();
          });
        }
      ],
      function (err, res) {
        done();
      }
    );
  });



});


