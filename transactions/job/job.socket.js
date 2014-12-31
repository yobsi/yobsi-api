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
};

function jobWasCreated (jobCreated) {
  console.log('================== jobWasCreated called');

  async.waterfall(
    [
      function getProfessionals (next) {
        console.log('xxxxxxxxxxxx getting professionals');
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
        console.log('notifying professionals');
        console.log(professionals);
        // notify professionals there is a job available
        console.log('are we sending io?');
        console.log(!_io);
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

  console.log('////////////////////////////');
  console.log('someoneWantsTheJob: ');
  console.log(professionalEmail);
  console.log('////////////////////////////');

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
        console.log('------------++++++++++++ TAKING THE JOB FOR ' + professionalEmail);
        jobUtil.takeTheJob(jobId, professionalEmail, function (err, job) {
          if (err) {
            next(err);
            return;
          }

          next();
        });
      },

      function notifyWorkerWasSelected (next) {
        console.log('------------++++++++++++ NOTIFYING THE WORKER ' + professionalEmail);
        jobUtil.notifyWorkerWasSelected(io, professionalEmail, jobId, function (err) {
          next(err);
        });
      }
    ],
    function (err, res) {
      console.log('------------++++++++++++ FLOW FINISHED ' + professionalEmail);
      if (err) {
        socket.emit('want-to-take-job', {error: err});
        return;
      }
    }
  );
}
