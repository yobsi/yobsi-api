'use strict';

var should = require('should');
var app = require('../../index.js');
var request = require('supertest');
var util = require('./util.js');
var async = require('async');

describe('Job API Test', function () {

  before(function (done) {
    util.cleanJobsOnDB(done);
  });

  afterEach(function (done) {
    util.cleanJobsOnDB(done);
  });

  it('should pick up a professional', function (done) {
    var token;

    async.series(
      [
        function createProfessionals (next) {
          util.createProfessionals(app, next);
        },

        function authenticateUser (next) {
          var credentials = {
            email: 'wilson.balderrama@gmail.com',
            password: 'sesamo'
          };
          util.authenticateUser(app, credentials, function (err, res) {
            token = res.body.token;
            token.should.exist;
            next();
          });
        },

        function searchingForAProfessional (next) {
          util.searchForProfessional(app, token, ['programmer'], function (err, res) {
            res.body.should.be.an.instanceof(Array).and.have.lengthOf(2);
            next();
          });
        }
      ],
      function (err, res) {
        done(err);
      }
    );
  });

  it('should create a job');

  it('should create a job review');

});

