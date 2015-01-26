'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var app = express();
var server = require('http').Server(app);
var config = require('./configuration/environment/index.js');
var io = require('socket.io')(server);
var logger = require('./configuration/logger.js');

// For production you need to set this env variables first
// NODE_ENV (development (default), test, production)
// SESSION_SECRET
// MONGOLAB_URI
// MAILGUN_APIKEY
// MAILGUN_DOMAIN
// LOGENTRIES_TOKEN

//  configure database
require('./configuration/mongoose.js')(config);

//  configure web framework
require('./configuration/express.js')(app);

//  configure routes
require('./routes.js')(app);

// configure socketio
require('./configuration/socketio.js')(io);

//  web server listening..
server.listen(config.port, function () {
  console.log('Express server listening on %d in %s mode', config.port, app.get('env'));
});

process.on('uncaughtException', function (err) {
  logger.log('error', err.stack);
});

module.exports = app;
