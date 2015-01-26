'use strict';

var jobEmitter = require('./job.emitter.js');
var jobUtil = require('./job.util.js');
var async = require('async');
var _io, _socket;

jobEmitter.on('job-created', jobWasCreated);

module.exports.register = function (socketio, socket) {
  _io = socketio;
  _socket = socket;

  socket.on('want-to-take-job', someoneWantsTheJob.bind(undefined, socketio, socket));
  socket.on('hire-professional', clientWantsToHireProfessional.bind(undefined, socketio, socket));
  // socket.on('someone-wants-to-cancel-the-job', cancelJob.find(undefined, socketio, socket));
};

function cancelJob (io, socket, data) {
  var jobId = data.jobId;
  jobUtil.cancelJob(io, jobId, function (err, job) {
    if (err) {
      socket.emit('someone-wants-to-cancel-the-job', {error: err});
      return;
    }

    socket.emit('someone-wants-to-cancel-the-job', {job: jobFound});
  });
}

function clientWantsToHireProfessional (io, socket, data) {
  var jobId = data.jobId;

  jobUtil.hireProfessional(jobId, io, function (err, job) {
    if (err) {
      socket.emit('hire-professional', {error: err});
      return;
    }

    socket.emit('hire-professional', {job: job});
  });
}

function jobWasCreated (jobCreated) {
  async.waterfall(
    [
      function getProfessionals (next) {
        // get all professionals suggested by the system
        jobUtil.findProfessionalBy(jobCreated.skillsRequired, function (err, professionals) {
          if (err) {
            next(err);
            return;
          }

          next(null, professionals || []);
        });
      },
      function notifyProfessionals (professionals, next) {
        // notify professionals there is a job available
        jobUtil.notifyJobAvailableTo(professionals, _io, jobCreated);
      }
    ],
    function (err, res) {

    }
  );
}

function someoneWantsTheJob (io, socket, data) {
  var jobId = data.jobId;
  var professionalEmail = data.professionalEmail;

  async.series(
    [
      // function checkIfJobWasTaken (next) {
      //   jobUtil.isJobAvailable(jobId, function (err, available) {
      //     if (err) {
      //       next(err);
      //       return;
      //     }

      //     if (!available) {
      //       next(new Error ('Job was taken, sorry.'));
      //       return;
      //     }

      //     next();
      //   });
      // },

      function takeTheJob (next) {
        jobUtil.takeTheJob(jobId, professionalEmail, function (err, job) {
          if (err) {
            next(err);
            return;
          }

          next();
        });
      },

      function notifyWorkerWasSelected (next) {
        jobUtil.notifyWorkerWasSelected(io, professionalEmail, jobId, function (err) {
          next(err);
        });
      }
    ],
    function (err, res) {
      if (err) {
        socket.emit('want-to-take-job', {error: err});
        return;
      }
    }
  );
}
