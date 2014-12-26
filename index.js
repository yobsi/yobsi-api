'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var app = express();
var config = require('./configuration/environment/index.js');

//  configure database
require('./configuration/mongoose.js')(config);

//  configure web framework
require('./configuration/express.js')(app);

//  configure routes
require('./routes.js')(app);

//  web server listening..
app.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d in %s mode', config.port, app.get('env'));
});

module.exports = app;
