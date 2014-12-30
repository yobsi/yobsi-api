'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JobSchema = new Schema({
  state: {type: String, default: 'new'}, // possible states: new, evaluating, complete
  skillsRequired: [String],
  clientEmail: String,
  professionalEmail: String,
  descriptionReview: String,
  rating: Number
});

module.exports = mongoose.model('Job', JobSchema);