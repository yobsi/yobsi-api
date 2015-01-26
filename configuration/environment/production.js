'use strict';

module.exports = {
  port: process.env.PORT,
  mongo: {
    uri: process.env.MONGOLAB_URI
  }
};