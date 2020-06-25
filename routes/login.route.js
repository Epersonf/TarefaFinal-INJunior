const { Router } = require('express');
const passport = require('passport');
const {
  getLoginToken,
  getResetPasswordToken
} = require('../helpers/auth.helper');
const { mailer } = require('../services/mailer.service');
const { UserModel } = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { config } = require('../config');

const loginApi = Router();

loginApi
  .route('/')
  .post(passport.authenticate('local'), async (req, res, next) => {
    const token = getLoginToken(req.user);
    res.status(200).json({
      message: 'login.success',
      token: token,
      user: req.user
    });
  });

loginApi.route('/forgot-password').get(async (req, res, next) => {
  const { email } = req.query;
  const user = await UserModel.findOne({ email });
  if (user) {
    const token = getResetPasswordToken(user);
    mailer.sendMail(
      {
        to: email,
        html: `Recovery token: ${token}`
      },
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
  }
  res.status(200).json({
    message: 'forgotPassword.emailSent'
  });
});

loginApi.route('/reset-password').post(async (req, res, next) => {
  const { token, password, confirmPassword } = req.body;
  if (!(password && password === confirmPassword)) {
    return res.status(403).json({
      message: 'forgotPassword.passwordNotMatching'
    });
  }
  jwt.verify(token, config.secretKey, async (err, decoded) => {
    if (!err) {
      const user = await UserModel.findById(decoded.id);
      const isValid = user && user.email === decoded.email;
      if (isValid) {
        user.set('password', password);
        user.save();
        return res.status(200).json({
          message: 'forgotPassword.reset'
        });
      }
    }
    return res.status(403).json({
      message: 'forgotPassword.invalidToken'
    });
  });
});

module.exports = { loginApi };
