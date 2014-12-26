'use strict';

var Professional = require('../professional/professional.model.js');
var request = require('supertest');

module.exports = {
  cleanProfessionalsOnDB: cleanProfessionalsOnDB,
  createUser: createUser,
  authenticateUser: authenticateUser
};


function cleanProfessionalsOnDB (done) {
  Professional.remove({}).exec().then(function () {
    done();
  });
}

function createUser (app, body, cb) {
   request(app)
    .post('/api/professionals')
    .send(body)
    .end(cb);
}

function authenticateUser (app, body, cb) {
  request(app)
    .post('/auth/local')
    .send(body)
    .end(cb);
}