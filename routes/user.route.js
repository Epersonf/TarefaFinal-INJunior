const { Router } = require('express');
const { UserModel } = require('../models/user.model');
const passport = require('passport');
const { verifyToken } = require('../helpers/auth.helper');
const { handleGetFilters } = require('../helpers/request.helper');

const userApi = Router();

userApi
  .route('/')
  .post(async (req, res, next) => {
    try {
      UserModel.register(
        new UserModel(req.body),
        req.body.password,
        (err, newUser) => {
          if (err) {
            return res.status(500).json({ err: err });
          }

          passport.authenticate('local')(req, res, function () {
            return res.status(200).json({
              message: 'user.created',
              user: newUser.toJSON()
            });
          });
        }
      );
    } catch (e) {
      next(e);
    }
  })
  .get(verifyToken(['admin', 'self']), async (req, res, next) => {
    try {
      const users = await handleGetFilters(req.query, UserModel);
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  })
  .put(
    (req, res, next) => {
      req.body.password || req.body.active
        ? verifyToken(['admin', 'controller'])(req, res, next)
        : verifyToken(['admin', 'controller', 'self'])(req, res, next);
    },
    async (req, res, next) => {
      const { id } = req.query;
      const user = req.body;
      if (id) {
        try {
          const updatedUser = await UserModel.updateOne(
            { _id: id },
            { $set: user }
          );
          res.status(200).json({
            message: 'user.updated',
            info: updatedUser
          });
        } catch (err) {
          return next(err);
        }
      } else {
        return res.status(400).json({
          message: 'user.missingId'
        });
      }
    }
  )
  .delete(verifyToken(['admin', 'controller']), async (req, res, next) => {
    const { id } = req.query;
    if (id) {
      try {
        const updatedUser = await UserModel.updateOne(
          { _id: id },
          {
            $set: {
              active: false,
              deactivatedAt: new Date()
            }
          }
        );
        res.json({
          message: 'user.deleted',
          info: updatedUser
        });
      } catch (err) {
        return next(err);
      }
    } else {
      return res.status(400).json({
        message: 'user.missingId'
      });
    }
  });

module.exports = { userApi };
