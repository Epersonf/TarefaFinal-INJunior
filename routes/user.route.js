const { Router } = require('express');
const { UserModel, Roles } = require('../models/user.model');
const passport = require('passport');
const { verifyToken } = require('../helpers/auth.helper');
const { handleGetFilters, updateUser } = require('../helpers/user.helper');
const { createNewConsultant } = require('../helpers/consultant.helper');
const { SupervisorModel } = require('../models/supervisor.model');
const { StockistModel } = require('../models/stockist.model');

const userApi = Router();

userApi
  .route('/')
  .post(async (req, res, next) => {
    const { role, supervisorId, ...userBasicData } = req.body;
    if (Roles.indexOf(role) === -1) {
      const err = new Error('user.invalidRole');
      err.status = 401;
      next(err);
    }
    const userData = {
      ...userBasicData,
      roles: [role],
      currentRole: role
    };
    try {
      UserModel.register(
        new UserModel(userData),
        userData.password,
        async (err, newUser) => {
          if (err) {
            next(err);
          }

          if (role === 'consultant') {
            await createNewConsultant({
              user: newUser._id,
              supervisor: supervisorId || null,
              fullName: newUser.fullName
            });
          }

          if (role === 'supervisor') {
            await SupervisorModel.create({
              user: newUser._id,
              supervisor: supervisorId || null,
              fullName: newUser.fullName
            });
          }

          if (role === 'stockist') {
            await StockistModel.create({
              user: newUser._id,
              fullName: newUser.fullName
            });
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
  .get(
    verifyToken(['admin', 'controller', 'self', 'supervisor', 'stockist']),
    async (req, res, next) => {
      try {
        const users = await handleGetFilters(req.query, UserModel);
        res.status(200).json(users);
      } catch (e) {
        next(e);
      }
    }
  )
  .put(
    (req, res, next) => {
      req.body.password || req.body.active || req.body.newRole
        ? verifyToken(['admin', 'controller'])(req, res, next)
        : verifyToken(['admin', 'controller', 'self', 'supervisor'])(
            req,
            res,
            next
          );
    },
    async (req, res, next) => {
      const { id } = req.query;
      const data = req.body;
      if (id) {
        try {
          const updatedUser = await updateUser(id, data);
          res.status(200).json({
            message: 'user.updated',
            data: updatedUser
          });
        } catch (err) {
          return next(err);
        }
      } else {
        const error = new Error('user.missingId');
        error.status = 400;
        next(error);
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
      const error = new Error('user.missingId');
      error.status = 400;
      next(error);
    }
  });

module.exports = { userApi };
