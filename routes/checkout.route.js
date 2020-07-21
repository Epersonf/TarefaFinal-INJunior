const { Router } = require('express');
const { CheckoutModel } = require('../models/checkout.model');
const { verifyToken } = require('../helpers/auth.helper');

const checkoutApi = Router();

checkoutApi
  .route('/')
  .get(
    verifyToken(['admin', 'controller', 'consultant', 'supervisor']),
    async (req, res, next) => {
      try {
        const checkouts = await CheckoutModel.find(req.query);
        return res.status(200).json(checkouts);
      } catch (e) {
        next(e);
      }
    }
  )
  .put(
    verifyToken(['admin', 'controller', 'consultant', 'supervisor']),
    async (req, res, next) => {
      const { id } = req.query;
      const checkout = req.body;
      if (id) {
        try {
          const updatedcheckout = await CheckoutModel.updateOne(
            { _id: id },
            { $set: checkout }
          );
          res.status(200).json({
            message: 'checkout.updated',
            info: updatedcheckout
          });
        } catch (err) {
          return next(err);
        }
      } else {
        return res.status(400).json({
          message: 'checkout.missingId'
        });
      }
    }
  );

module.exports = { checkoutApi };
