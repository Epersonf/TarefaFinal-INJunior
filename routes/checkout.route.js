const { Router } = require('express');
const { CheckoutModel } = require('../models/checkout.model');
const { verifyToken, checkRoles } = require('../helpers/auth.helper');
const {
  handleGetFilters,
  getCheckoutReport,
  getReportsForConsultants,
  closeCheckout
} = require('../helpers/checkout.helper');
const { RecomendationModel } = require('../models/recommendation.model');
const { ConsultantModel } = require('../models/consultant.model');

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
      const { id, bySupervisor, allConsultants } = req.query;
      if (!id && !bySupervisor && !allConsultants) {
        return res.status(400).json({
          message: 'checkout.missingId'
        });
      }
      if (id) {
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
      } else if (bySupervisor) {
        try {
          const supConsultants = await ConsultantModel.find({
            active: true,
            approved: true,
            supervisor: bySupervisor
          });

          const reports = await getReportsForConsultants(supConsultants);

          res.status(200).json(reports);
        } catch (e) {
          next(e);
        }
      } else if (allConsultants) {
        if (checkRoles(['admin', 'controller'], req.user, req.user._id)) {
          try {
            const consultants = await ConsultantModel.find({
              active: true,
              approved: true
            });

            const reports = await getReportsForConsultants(consultants);

            res.status(200).json(reports);
          } catch (e) {
            next(e);
          }
        } else {
          next({
            status: 401,
            message: 'token.unauthorized'
          });
        }
      }
    }
  );

module.exports = { checkoutApi };
