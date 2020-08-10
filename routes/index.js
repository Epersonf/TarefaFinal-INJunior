const { Router } = require('express');
const { loginApi } = require('./login.route');
const { userApi } = require('./user.route');
const { consultantApi } = require('./consultant.route');
const { supervisorApi } = require('./supervisor.route');
const { stockistApi } = require('./stockist.route');
const { checkoutApi } = require('./checkout.route');

const api = Router();

api.get('/health-check', (req, res) => res.status(200).json('ok'));
api.use('/login', loginApi);
api.use('/user', userApi);
api.use('/consultant', consultantApi);
api.use('/supervisor', supervisorApi);
api.use('/stockist', stockistApi);
api.use('/checkout', checkoutApi);

// handling 404
api.use((req, res, next) => {
  const err = new Error('Not Found');
  err.name = 'error.notFound';
  err.status = 404;
  next(err);
});

// handling erros
api.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err.name
  });
});

module.exports = { api };
