'use strict';

var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

function JobEmitter () {

}

inherits(JobEmitter, EventEmitter);

JobEmitter.prototype.notifyJobCreated = function (job) {
  this.emit('job-created', job);
};

module.exports = new JobEmitter();