var express = require('express');
var exchange = require('./exchange')
var gift = require('./gift')
var history = require('./history')
var kit = require('./kit')
var log = require('./log')
var notification = require('./notification')
var order = require('./order')
var payment = require('./payment')
var user = require('./user')

var api = express.Router();

api.use('/exchange', exchange);
api.use('/gift', gift);
api.use('/history', history);
api.use('/kit', kit);
api.use('/log', log);
api.use('/notification', notification);
api.use('/order', order);
api.use('/payment', payment);
api.use('/user', user);

module.exports = api;
