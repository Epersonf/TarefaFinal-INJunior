const { Router } = require('express');
const { StockistModel } = require('../models/stockist.model');
const { handleGetFilters } = require('./../helpers/stockist.helper');
const { verifyToken } = require('../helpers/auth.helper');

const stockistApi = Router();

stockistApi
  .route('/')
  .post(async (req, res, next) => {
    const stockist = req.body;
    try {
      const newSupervisor = StockistModel.create(stockist);
      res.status(200).json(newSupervisor);
    } catch (err) {
      return next(err);
    }
  })
  .get(async (req, res, next) => {
    try {
      const { inactive, ...query } = req.query;
      const consultants = await handleGetFilters(query, StockistModel);
      if (Array.isArray(consultants) && !inactive) {
        const filteredConsultants = await StockistModel.populate(consultants, [
          {
            path: 'user',
            select:
              'fullName adress phoneNumber active username email cpf city cep'
          }
        ]);
        res
          .status(200)
          .json(
            filteredConsultants.filter(
              (stockist) => stockist.user.active === true
            )
          );
      } else {
        res.status(200).json(consultants);
      }
    } catch (e) {
      next(e);
    }
  })
  .put(verifyToken(['admin', 'controller', 'self']), async (req, res, next) => {
    const { id } = req.query;
    const stockist = req.body;
    if (id) {
      try {
        const updatedConsultant = await StockistModel.updateOne(
          { _id: id },
          { $set: stockist }
        );
        res.status(200).json({
          message: 'stockist.updated',
          info: updatedConsultant
        });
      } catch (err) {
        return next(err);
      }
    } else {
      return res.status(400).json({
        message: 'stockist.missingId'
      });
    }
  });

module.exports = { stockistApi };
