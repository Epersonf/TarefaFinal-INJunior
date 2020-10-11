const { Router } = require('express');
const { CheckoutModel } = require('../models/checkout.model');
const { verifyToken } = require('../helpers/auth.helper');
const {
  handleGetFilters,
  getCheckoutReport,
  closeCheckout
} = require('../helpers/checkout.helper');
const { RecomendationModel } = require('../models/recommendation.model');

const checkoutApi = Router();

checkoutApi
  .route('/')
  .get(
    verifyToken(['admin', 'controller', 'consultant', 'supervisor']),
    async (req, res, next) => {
      try {
        const checkouts = await handleGetFilters(req.query, CheckoutModel);
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
          if (checkout.status && checkout.status === 'closed') {
            const newCheckout = await closeCheckout(id);
            res.status(200).json({
              message: 'checkout.closed',
              data: newCheckout
            });
          } else {
            const updatedcheckout = await CheckoutModel.updateOne(
              { _id: id },
              { $set: checkout }
            );
            res.status(200).json({
              message: 'checkout.updated',
              data: updatedcheckout
            });
          }
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

checkoutApi
  .route('/report')
  .get(
    verifyToken(['admin', 'controller', 'consultant', 'supervisor']),
    async (req, res, next) => {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({
          message: 'checkout.missingId'
        });
      }
      try {
        const checkout = await CheckoutModel.findById(id)
          .populate('gifts')
          .populate('replacements');
        const openRecommendations = await RecomendationModel.find({
          status: 'open',
          recommendee: checkout.user
        })
          .populate('recommendee')
          .populate('recommended');
        const report = getCheckoutReport(checkout, openRecommendations);
        return res.status(200).json(report);
      } catch (e) {
        next(e);
      }
    }
  );

module.exports = { checkoutApi };
