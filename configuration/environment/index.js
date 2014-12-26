'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv (name) {
  if (!process.env[name]) {
    throw new Error('You must set ' + name + ' environment variable');
  }

  return process.env[name];
}
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


var all = {
  ip: process.env.IP || 'http://localhost',
  env: process.env.NODE_ENV,
  port: process.env.PORT || 9000,
  seedDB: false,
  secrets: {
    session: 'secreto'
  },
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};

module.exports = _.merge(
    all, 
    require('./' + process.env.NODE_ENV + '.js') || {}
  );