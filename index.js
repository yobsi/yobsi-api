'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = request('express');
var app = express();
var config = request('./configuration/environment/index.js');

require('./configuration/mongoose.js')(config);
require('./configuration/express.js')(app);
require('./routes.js');

server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d in %s mode', config.port, app.get('env'));
});

module.exports = app;
