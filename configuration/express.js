'use strict';

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment/index.js');
var passport = require('passport');

module.exports = function (app) {
  var env = process.env.NODE_ENV;

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(passport.initialize());
  app.use(morgan('dev'));

  if (env === 'production') {
  }

  if (env === 'development' || env === 'test') {
    app.use(errorHandler());
  }
};