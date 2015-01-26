'use strict';

var Job = require('../job/job.model.js');
var Professional = require('../../membership/professional/professional.model.js');
var request = require('supertest');
var async = require('async');

module.exports = {
  createProfessionals: createProfessionals,
  cleanJobsOnDB: cleanJobsOnDB,
  cleanProfessionalsOnDB: cleanProfessionalsOnDB,
  searchForProfessional: searchForProfessional,
  authenticateUser: authenticateUser,
  createJob: createJob,
  takeJob: takeJob,
  hireProfessional: hireProfessional
};

function hireProfessional (socket, job, cb) {
  socket.emit('hire-professional', {
    jobId: job._id
  });

  socket.on('hire-professional', function (data) {
    cb(null, data);
  });
}

function takeJob (socket, job, professionalEmail, cb) {
  socket.emit('want-to-take-job', {
    jobId: job._id,
    professionalEmail: professionalEmail
  });

  socket.on('want-to-take-job', cb);
}

function createJob (token, app, clientEmail, skillsRequired, cb) {
  request(app)
    .post('/api/jobs')
    .set('Authorization', 'Bearer ' + token)
    .send({
      clientEmail: clientEmail,
      skillsRequired: skillsRequired
    })
    .end(cb);
}

function createProfessionals (app, done) {
  async.series(
    [
      function createProfessional (next) {
        var professional = {
          name: 'Wilson Balderrama',
          email: 'wilson.balderrama@gmail.com',
          password: 'sesamo',
          skills: ['node.js']
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
          skills: ['node.js', 'mongodb']
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
          skills: ['express.js', 'node.js']
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

function cleanProfessionalsOnDB (done) {
  Professional.remove({}).exec().then(
    function () {
      done();
    }
  );
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