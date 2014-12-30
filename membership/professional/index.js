'use strict';

var express = require('express');
var controller = require('./professional.controller.js');
var config = require('../../configuration/environment/index.js');
var auth = require('../auth/auth.service');

var router = express.Router();

router.post('/', controller.create);
router.get('/me', auth.isAuthenticated(), controller.me);

module.exports = router;