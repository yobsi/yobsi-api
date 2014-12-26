'use strict';

var mongoose = require('mongoose');

module.exports = function (config) {
  mongoose.connect(config.mongo.uri, config.mongo.options);

  if (config.seedDB) {
    require('./seed.js');
  }
}
