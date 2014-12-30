'use strict';

var should = require('should');
var app = require('../../index.js');
var request = require('supertest');
var util = require('./util.js');
var async = require('async');
var io = require('socket.io-client');
var token;
var options = {
  'forceNew': true
};
var url = 'http://localhost:9000';

describe('Job API Test', function () {

  before(function (done) {
    async.series(
      [
        function cleanJobs (next) {
          util.cleanJobsOnDB(next);
        },
        function cleanProfessionals (next) {
          util.cleanProfessionalsOnDB(next);
        }
      ],
      function (err, res) { 
        done();
      }
    );
  });

  beforeEach(function (done) {
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
        }
      ],
      done
    );
  });

  afterEach(function (done) {
    util.cleanJobsOnDB(done);
  });

  it.skip('should connect to socket server', function (done) {
    var socket = io.connect(url, _.merge(options, {}));
    socket.once('connect', function (data) {
      done();
    });
  });

  it('should create a job', function (done) {
    var keilaSocket;
    var santiagoSocket;

    async.parallel(

      [
        function createKeilaSocket (next) {

          // async.series(
          //   [
          //     function generateToken (n) {

          //     },

          //     function connectServer (n) {

          //     }
          //   ],
          //   function (err, res) {
          //     next(err);
          //   }
          // );

          console.log(' -------------------------- connecting keila socket');
          keilaSocket = io.connect(url, options);

          keilaSocket.emit('connectServer', {email: 'keila.balderrama@gmail.com'});

          keilaSocket.on('connect', function (data) {
            console.log('--------------------------Keila is connected');
          });

          keilaSocket.on('is-someone-available', function (data) {
            console.log('-------------------------- keila was notified');
            next();
          });
        },

        function createSantiagoSocket (next) {
          console.log('-------------------------- connecting santiago socket');
          santiagoSocket = io.connect(url, options);

          santiagoSocket.emit('connectServer', {email: 'santiago.balderrama@gmail.com'});

          santiagoSocket.on('connect', function (data) {
            console.log('--------------------------Santiago is connected');
          });
          santiagoSocket.on('is-someone-available', function (data) {
            console.log('-------------------------- santiago was notified');
            next();
          });
        },

        function createJob (next) {
          console.log('-------------------------- creating job');
          setTimeout(function () {
            util.createJob(
              token,
              app,
              'wilson.balderrama@gmail.com',
              ['node.js', 'mongodb', 'express.js'],
              function (err, res) {
                console.log(res.body);
                var data = res.body;
                res.status.should.equal(200);
                next(err);
              }
            );
          }, 1000);
        }
      ],
      function (err, res) {
        console.log('-------------------------- created job');
        done(err);
      }
    );

  });

  it('should create a job review');

});

