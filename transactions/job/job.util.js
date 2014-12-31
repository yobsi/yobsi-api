var Professional = require('../../membership/professional/professional.model.js');
var Job = require('./job.model.js');
var async = require('async');

module.exports = {
  findProfessionalBy: findProfessionalBy,
  notifyJobAvailableTo: notifyJobAvailableTo,
  notifyWorkerWasSelected: notifyWorkerWasSelected,
  isJobAvailable: isJobAvailable,
  takeTheJob: takeTheJob
};

function isJobAvailable (jobId, cb) {
  Job.findOne({
    _id: jobId
  }, function (err, job) {
    if (err) {
      cb(err);
      return;
    }
    console.log('isJobAvailable');
    console.log(job.state);
    cb(err, job.state === 'new');
  });
}

function takeTheJob (jobId, professionalEmail, cb) {
  Job.findOneAndUpdate({
    _id: jobId,
    state: 'new'
  },{
    state: 'evaluating',
    professionalEmail: professionalEmail
  }, function (err, job) {
    if (err) {
      cb(err);
      return;
    }

    if (!job) {
      console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
      console.log(professionalEmail + ' could not take the job =(');
      console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
      cb(new Error('job was taken.'));
      return;
    }

    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
    console.log(professionalEmail + ' could take the job :)');
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
      
    cb(null, job);

    // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
    // console.log('isJobAvailable');
    // console.log(job.state);

    // if (job.state === 'new') {
    //   console.log('this code was run');
    //   console.log('professionalEmail: ' + professionalEmail);
    //   job.state = 'evaluating';
    //   job.professionalEmail = professionalEmail;
    //   job.save(function (err, j) {
    //     console.log('j: ');
    //     console.log(j);
    //     console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
    //     cb();
    //   });
    // } 


  });
}

function notifyWorkerWasSelected (io, workerEmail, jobId, cb) {
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
        io.to(workerEmail).emit('want-to-take-job', {
          clientEmail: client.email,
          jobId: jobId
        });
        next();
      }
    ],
    function (err, res) {
      cb(err);
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