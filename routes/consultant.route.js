const { Router } = require('express');
const { ConsultantModel } = require('../models/consultant.model');
const { createNewConsultant } = require('./../helpers/consultant.helper');
const { verifyToken } = require('../helpers/auth.helper');

const consultantApi = Router();

consultantApi
  .route('/')
  .post(async (req, res, next) => {
    const consultant = req.body;
    try {
      const { newConsultant, newCheckout } = createNewConsultant(consultant);
      res.status(200).json({ newConsultant, newCheckout });
    } catch (err) {
      return next(err);
    }
  })
  .get(async (req, res, next) => {
    try {
      const consultants = await ConsultantModel.find(req.query)
        .populate('user', 'fullName adress phoneNumber active')
        .populate('supervisor', 'fullName adress phoneNumber active');
      res.status(200).json(consultants);
    } catch (e) {
      next(e);
    }
  })
  .put(verifyToken(['admin', 'controller', 'self']), async (req, res, next) => {
    const { id } = req.query;
    const consultant = req.body;
    if (id) {
      try {
        const updatedConsultant = await ConsultantModel.updateOne(
          { _id: id },
          { $set: consultant }
        );
        res.status(200).json({
          message: 'consultant.updated',
          info: updatedConsultant
        });
      } catch (err) {
        return next(err);
      }
    } else {
      return res.status(400).json({
        message: 'consultant.missingId'
      });
    }
  });

module.exports = { consultantApi };
