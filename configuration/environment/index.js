'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var _ = require('lodash');

var all = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 9000,
  seedDB: false,
  secrets: {
    session: process.env.SESSION_SECRET || 'secreto'
  },
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  logentries: {
    token: process.env.LOGENTRIES_TOKEN
  },
  mailgun: {
    api_key: process.env.MAILGUN_APIKEY || 'key-43aejvbi-ka-xdqawgednpd50nyy85n4',
    domain: process.env.MAILGUN_DOMAIN || 'exclusr.com'
  }
};

module.exports = _.merge(
  all, 
  require('./' + process.env.NODE_ENV + '.js')
);