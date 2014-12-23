'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../../configuration/index.js');
var User = require('../professional/professional.model.js');

require('./local/passport.js').setup(User, config);

var router = express.Router();

router.use('/local', require('./local/index.js'));

module.exports = router;
