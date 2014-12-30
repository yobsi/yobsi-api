var Professional = require('../../membership/professional/professional.model.js');
var Job = require('./job.model.js');
var async = require('async');

module.exports = {
  findProfessionalBy: findProfessionalBy,
  notifyJobAvailableTo: notifyJobAvailableTo,
  notifyWorkerWasSelected: notifyWorkerWasSelected
};

function notifyWorkerWasSelected (io, workerEmail, jobid, cb) {
  async.waterfall(
    [
      function getJob (next) {
        Job.findOne({}, function (err, job) {
          if (err) {
            next(err);
            return;
          }

          if (!job) {
            next(new Error('No job found.'));
            return;
          }

          next(null, job.clientEmail);
        });
      },

      function getClientEmail (clientEmail, next) {
        Professional.findOne({
          email: clientEmail
        }, function (err, user) {
          if (err) {
            next(err);
            return;
          }

          if (!user) {
            next(new Error('No user found.'));
            return;
          }

          next(null, user);
        });
      },

      function notifyWorker (client, next) {
        io.to(workerEmail).emit('you-were-selected', {
          clientEmail: client.email,
          jobId: jobId
        });
        next();
      }
    ],
    function (err, res) {
    }
  );  
}

function notifyJobAvailableTo (professionals, io, job) {
  professionals.forEach(function (professional) {
    console.log('notifying to this professional: ');
    console.log(professional.email);
    io.to(professional.email).emit('is-someone-available', job);
  });
}

function findProfessionalBy (skillsRequired, cb) {
  Professional
    .find({
      skills: {
        $in: skillsRequired
      }
    })
    .limit(10)
    .exec(function (err, professionals) {
      if (err) {
        cb(err);
        return;
      }

      cb(null, professionals || []);
    });
}