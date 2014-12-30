'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var app = express();
var server = require('http').Server(app);
var config = require('./configuration/environment/index.js');
var io = require('socket.io')(server);

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
// server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d in %s mode', config.port, app.get('env'));
});

process.on('uncaughtException', function (err) {
  console.log(err);
  console.log(err.stack);
});

module.exports = app;
