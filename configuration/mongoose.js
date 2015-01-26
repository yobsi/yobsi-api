'use strict';

var mongoose = require('mongoose');
var db = mongoose.connection;
var logger = require('./logger.js');

module.exports = function (config) {
  mongoose.connect(config.mongo.uri, config.mongo.options);

  db.on('error', console.log.bind(console, 'database connection error:ß'));

  db.once('open', function () {
    console.log('database connection was succesfull.');
  });

  if (config.seedDB) {
    require('./seed.js');
  }
}
