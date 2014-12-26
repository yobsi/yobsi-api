'use strict';

var Job = require('../job/job.model.js');
var request = require('supertest');
var async = require('async');

module.exports = {
  createProfessionals: createProfessionals,
  cleanJobsOnDB: cleanJobsOnDB,
  searchForProfessional: searchForProfessional,
  authenticateUser: authenticateUser
};

function createProfessionals (app, done) {
  async.series(
    [
      function createProfessional (next) {
        var professional = {
          name: 'Wilson Balderrama',
          email: 'wilson.balderrama@gmail.com',
          password: 'sesamo',
          skills: ['programmer']
        };

        request(app)
          .post('/api/professionals')
          .send(professional)
          .end(next);
      },
      function createNextProfessional (next) {
        var professional = {
          name: 'Keila Balderrama',
          email: 'keila.balderrama@gmail.com',
          password: 'sesamo',
          skills: ['manager']
        };

        request(app)
          .post('/api/professionals')
          .send(professional)
          .end(next);
      },
      function createAnotherProfessional (next) {
        var professional = {
          name: 'Santiago Balderrama',
          email: 'santiago.balderrama@gmail.com',
          password: 'sesamo',
          skills: ['programmer', 'android']
        };

        request(app)
          .post('/api/professionals')
          .send(professional)
          .end(next);
      }
    ],
    function (err, res) {
      done(err);
    }
  );
}

function authenticateUser (app, body, cb) {
  request(app)
    .post('/auth/local')
    .send(body)
    .end(cb);
}

function cleanJobsOnDB (done) {
  Job.remove({}).exec().then(
    function () {
      done();
    }
  );
}

function searchForProfessional (app, token, skillsRequired, cb) {
  request(app)
    .get('/api/professionals')
    .set('Authorization', 'Bearer ' + token)
    .query({
      skillsRequired: skillsRequired
    })
    .end(cb);
}