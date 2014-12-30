'use strict';

var Job = require('./job.model.js');
var jobEmitter = require('./job.emitter.js');

module.exports = {
  create: createJob
};

function createJob (req, res) {
  var newJob = new Job();

  newJob.clientEmail = req.body.clientEmail;
  newJob.skillsRequired = req.body.skillsRequired;

  newJob.save(function (err, job) {
    if (err) {
      res.status(400).json(err);
      return;
    }
    
    jobEmitter.notifyJobCreated(job);
    res.json(job);
  });
}