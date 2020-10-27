const { Router } = require('express');
const { loginApi } = require('./login.route');
const { userApi } = require('./user.route');
const { consultantApi } = require('./consultant.route');
const { supervisorApi } = require('./supervisor.route');
const { stockistApi } = require('./stockist.route');
const { checkoutApi } = require('./checkout.route');
const { pieceEntryApi } = require('./pieceEntry.route');
const { pieceTransactionApi } = require('./pieceTransaction.route');
const { sellingApi } = require('./selling.route');
const { giftApi } = require('./gift.route');
const { pieceReplacementApi } = require('./pieceReplacement.route');
const { requestApi } = require('./request.route');
const { recommendationApi } = require('./recommendation.route');

const api = Router();

api.get('/health-check', (req, res) => res.status(200).json('ok'));
api.use('/login', loginApi);
api.use('/user', userApi);
api.use('/consultant', consultantApi);
api.use('/supervisor', supervisorApi);
api.use('/stockist', stockistApi);
api.use('/checkout', checkoutApi);
api.use('/pieceEntry', pieceEntryApi);
api.use('/pieceTransaction', pieceTransactionApi);
api.use('/selling', sellingApi);
api.use('/gift', giftApi);
api.use('/pieceReplacement', pieceReplacementApi);
api.use('/request', requestApi);
api.use('/recommendation', recommendationApi);

// handling 404
api.use((req, res, next) => {
  const err = new Error('Not Found');
  err.name = 'error.notFound';
  err.status = 404;
  next(err);
});

// logging errors
api.use((err, req, res, next) => {
  if (!err.status || err.status === 500) {
    console.info('------------------------------');
    console.info('Error found on ' + new Date());
    console.info({ request: req });
    console.error(err);
    console.info('------------------------------');
  } else {
    console.err(`${err.status}: ${err.message}`);
  }
  next(err);
});

// handling erros
api.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err.name,
    data: err.data
  });
});

module.exports = { api };
