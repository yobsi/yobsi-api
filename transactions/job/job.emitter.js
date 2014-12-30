'use strict';

var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

function JobEmitter () {

}

inherits(JobEmitter, EventEmitter);

JobEmitter.prototype.notifyJobCreated = function (job) {
  console.log('emitting the notification of job creation');
  this.emit('job-created', job);
};

module.exports = new JobEmitter();