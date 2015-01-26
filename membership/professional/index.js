'use strict';

var express = require('express');
var controller = require('./professional.controller.js');
var config = require('../../configuration/environment/index.js');
var auth = require('../auth/auth.service');

var router = express.Router();

router.post('/', controller.create);
router.get('/me', auth.isAuthenticated(), controller.me);
router.post('/:username/reset-password', controller.sendLinkResetPasswordEmail);
router.put('/:userId/attributes/password', controller.resetPassword);

module.exports = router;