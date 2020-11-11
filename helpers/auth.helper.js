const jwt = require('jsonwebtoken');
const { config } = require('../config');

const getLoginToken = (user) => {
  return jwt.sign(
    { id: user._id, roles: user.roles, fullName: user.fullName },
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
        if (checkRoles(allowedRoles, decoded, id)) {
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

const checkRoles = (allowedRoles, user, id) => {
  if (allowedRoles.indexOf('all') > -1) {
    return true;
  }
  if (
    allowedRoles.filter((role) => user.roles.includes(role)).length > 0 ||
    (allowedRoles.indexOf('self') > -1 && id === user.id)
  ) {
    return true;
  }
};

module.exports = {
  getLoginToken,
  getResetPasswordToken,
  verifyToken,
  checkRoles
};
