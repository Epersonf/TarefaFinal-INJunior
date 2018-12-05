var express = require('express');
var notification = require('./notification')
var v1 = express.Router();

v1.use('/notification', notification);

module.exports = v1;
