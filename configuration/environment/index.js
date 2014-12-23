'use strict';

var path = require('path');
var _ = require('underscore');

function requiredProcessEnv (name) {
  if (!process.env[name]) {
    throw new Error('You must set ' + name + ' environment variable');
  }

  return process.env[name];
}

var all = {
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

modul.exports = _.merge(
    all, 
    require('./' + process.env.NODE_ENV + '.js') || {}
  );