var express = require('express');
var Verify = require('../verify');

var exchange = require('./exchange')
var gift = require('./gift')
var history = require('./history')
var kit = require('./kit')
var log = require('./log')
var notification = require('./notification')
var order = require('./order')
var payment = require('./payment')
var user = require('./user')
var pack = require('./pack')
var packItem = require('./packItem')

var api = express.Router();

api.use('/exchange', Verify.verifyOrdinaryUser, exchange);
api.use('/gift', Verify.verifyOrdinaryUser, gift);
api.use('/history', Verify.verifyOrdinaryUser, history);
api.use('/kit', Verify.verifyOrdinaryUser, kit);
api.use('/log', Verify.verifyOrdinaryUser, log);
api.use('/notification', Verify.verifyOrdinaryUser, notification);
api.use('/order', Verify.verifyOrdinaryUser, order);
api.use('/payment', Verify.verifyOrdinaryUser, payment);
api.use('/user', user);
api.use('/pack', Verify.verifyOrdinaryUser, pack);
api.use('/packItem', Verify.verifyOrdinaryUser, packItem);

module.exports = api;
