'use strict';

var logentries = require('le_node');
var log = logentries.logger({
  token: ''
});
var config = require('./environment/index.js');
var winston = require('winston');
var logger;

winston.remove(winston.transports.Console);

log.winston(winston);

module.exports = winston;