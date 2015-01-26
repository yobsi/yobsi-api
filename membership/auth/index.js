'use strict';

var express = require('express');
var User = require('../professional/professional.model.js');
var router = express.Router();

require('./local/passport.js').setup(User);

router.use('/', function (req, res, next) {
  if (req.body.fbId) {
    require('./facebook/index.js')(req, res, next);
  } else {
    require('./local/index.js')(req, res, next);
  }
});

module.exports = router;
