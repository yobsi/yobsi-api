'use strict';

module.exports = {
  ip: process.env.IP,
  port: process.env.PORT,
  mongo: {
    uri: process.env.MONGOLAB_URI
  }
};