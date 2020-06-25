const { Router } = require('express');
const { loginApi } = require('./login.route');
const { userApi } = require('./user.route');

const api = Router();

api.get('/health-check', (req, res) => res.status(200).json('ok'));
api.use('/login', loginApi);
api.use('/user', userApi);

// handling 404
api.use((req, res, next) => {
  const err = new Error('Not Found');
  err.name = 'error.notFound';
  err.status = 404;
  next(err);
});

// handling erros
api.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err.name
  });
});

module.exports = { api };
