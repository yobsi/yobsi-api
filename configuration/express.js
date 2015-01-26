'use strict';

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var config = require('./environment/index.js');
var passport = require('passport');

module.exports = function (app) {
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(passport.initialize());
  app.use(morgan('dev'));

  if (config.env === 'development' || config.env === 'test') {
    app.use(errorHandler());
  }
};