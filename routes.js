'use strict';

module.exports = function (app) {
  app.use('/auth', require('./membership/auth/index.js'));
  app.use('/api/professionals', require('./membership/professional/index.js'));
  app.use('/api/jobs', require('./transactions/job/index.js'));
};