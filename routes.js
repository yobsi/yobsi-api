'use strict';

module.exports = function (app) {
  app.use('/api/professionals', require('./membership/professional/index.js'));
  app.use('/auth', require('./membership/auth/index.js'));
};