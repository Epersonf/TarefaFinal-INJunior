var User = require('../../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../../config.js');

exports.getToken = function (user) {
  return jwt.sign({ id: user._id, type: user.tipo }, config.secretKey, {
    expiresIn: 84600
  });
};

exports.verifyOrdinaryUser = function (req, res, next) {
  // check header or url parameters or post parameters for token
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secretKey, function (err, decoded) {
      if (err) {
        const err = new Error('Usuário não autenticado');
        err.status = 401;
        return next(err);
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    let err = new Error('Usuário não logado');
    err.status = 403;
    return next(err);
  }
};

exports.verifyRole = (next, type, roles) => {
  if (!roles.includes(type)) {
    const err = new Error('Acesso negado!');
    err.status = 403;
    next(err);
  }
};
