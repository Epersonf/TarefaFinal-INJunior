const express = require('express');
const Verify = require('../verify');

const exchange = require('./exchange')
const gift = require('./gift')
const history = require('./history')
const kit = require('./kit')
const log = require('./log')
const notification = require('./notification')
const order = require('./order')
const payment = require('./payment')
const user = require('./user')
const collection = require('./collection')
const product = require('./product')
const tag = require('./tag')
const upload = require('./upload')
/* const pack = require('./pack')
const packItem = require('./packItem') */

const paypalWebhook = require('./paypalWebhook')

const api = express.Router();

api.use('/exchange', Verify.verifyOrdinaryUser, exchange);
api.use('/gift', Verify.verifyOrdinaryUser, gift);
api.use('/history', Verify.verifyOrdinaryUser, history);
api.use('/kit', Verify.verifyOrdinaryUser, kit);
api.use('/log', Verify.verifyOrdinaryUser, log);
api.use('/notification', Verify.verifyOrdinaryUser, notification);
api.use('/order', Verify.verifyOrdinaryUser, order);
api.use('/payment', Verify.verifyOrdinaryUser, payment);
api.use('/user', user);
api.use('/collection', Verify.verifyOrdinaryUser, collection);
api.use('/product', Verify.verifyOrdinaryUser, product);
api.use('/tag', Verify.verifyOrdinaryUser, tag);
api.use('/upload', Verify.verifyOrdinaryUser, upload);
/* api.use('/pack', Verify.verifyOrdinaryUser, pack);
api.use('/packItem', Verify.verifyOrdinaryUser, packItem); */
api.use('/paypal-webhook', paypalWebhook );

module.exports = api;
