const jwt = require('jsonwebtoken');
const { config } = require('../config');

const getLoginToken = (user) => {
  return jwt.sign(
    { id: user._id, currentRole: user.currentRole, fullName: user.fullName },
    config.secretKey,
    {
      expiresIn: 84600
    }
  );
};

const getResetPasswordToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, config.secretKey, {
    expiresIn: 40000
  });
};

const verifyToken = (allowedRoles) => (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];
  const { id } = req.query;
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secretKey, (err, decoded) => {
      if (err) {
        next({
          status: 403,
          message: 'token.invalid'
        });
      } else {
        if (
          allowedRoles.indexOf(decoded.currentRole) > -1 ||
          (allowedRoles.indexOf('self') > -1 && id === decoded.id)
        ) {
          req.user = decoded;
          next();
        } else {
          next({
            status: 401,
            message: 'token.unauthorized'
          });
        }
      }
    });
  } else {
    next({
      status: 403,
      message: 'token.notFound'
    });
  }
};

module.exports = {
  getLoginToken,
  getResetPasswordToken,
  verifyToken
};
