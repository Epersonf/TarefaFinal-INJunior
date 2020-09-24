const { Router } = require('express');
const { RequestModel } = require('../models/request.model');
const { handleGetFilters } = require('./../helpers/request.helper');
const { verifyToken } = require('../helpers/auth.helper');

const requestApi = Router();

requestApi
  .route('/')
  .post(async (req, res, next) => {
    const request = req.body;
    try {
      const newRequest = await RequestModel.create(request);
      res.status(200).json(newRequest);
    } catch (err) {
      return next(err);
    }
  })
  .get(async (req, res, next) => {
    try {
      const requests = await handleGetFilters(req.query, RequestModel);
      res.status(200).json(requests);
    } catch (e) {
      next(e);
    }
  })
  .put(
    verifyToken(['admin', 'controller', 'stockist', 'supervisor']),
    async (req, res, next) => {
      const { id } = req.query;
      const request = req.body;
      if (id) {
        try {
          const updatedRequest = await RequestModel.findOneAndUpdate(
            { _id: id },
            { $set: request },
            { new: true }
          );
          res.status(200).json({
            message: 'request.updated',
            request: updatedRequest
          });
        } catch (err) {
          return next(err);
        }
      } else {
        return res.status(400).json({
          message: 'request.missingId'
        });
      }
    }
  )
  .delete(
    verifyToken(['admin', 'controller', 'stockist', 'supervisor']),
    async (req, res, next) => {
      const { id } = req.query;
      if (id) {
        try {
          const updatedRequest = await RequestModel.updateOne(
            { _id: id },
            { $set: { status: 'canceled' } }
          );
          res.status(200).json({
            message: 'request.canceled',
            info: updatedRequest
          });
        } catch (err) {
          return next(err);
        }
      } else {
        return res.status(400).json({
          message: 'request.missingId'
        });
      }
    }
  );

module.exports = { requestApi };
