'use strict';
var should = require('should');
var app = require('../../index.js');
var Professional = require('../professional/professional.model.js');

var professional = new Professional({
  provider: 'local',
  name: 'Wilson Balderrama',
  email: 'wilson.balderrama@gmail.com',
  password: 'sesamo'
});

describe.skip('Professional Model', function () {

  before(function (done) {
    Professional.remove().exec().then(function () {
      done();
    });
  });

  afterEach(function (done) {
    Professional.remove().exec().then(function () {
      done();
    });
  });

  it('should being with no users', function (done) {
    Professional.find({}, function (err, users) {
      users.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate user', function (done) {
    professional.save(function () {
      var professionalDup = new Professional(professional);
      professionalDup.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without email', function (done) {
    professional.email = '';
    professional.save(function (err) {
      should.exist(err);
      done();
    });
  });


  it('should authenticate user if password is valid', function () {
    return professional.authenticate('sesamo').should.be.true;
  });

  it('should not authenticate user if password is invalid', function () {
    return professional.authenticate('whatever').should.be.false;
  });
});