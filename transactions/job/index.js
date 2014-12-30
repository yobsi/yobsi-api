'use strict';

var express = require('express');
var controller = require('./job.controller.js');
var config = require('../../configuration/environment/index.js');
var auth = require('../../membership/auth/auth.service.js');

var router = express.Router();

router.post('/', controller.create);

module.exports = router;