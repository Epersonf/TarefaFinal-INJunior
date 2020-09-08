const { Router } = require('express');
const { SellingModel } = require('../models/selling.model');
const {
  createSelling,
  deleteSelling,
  handleGetFilters
} = require('./../helpers/selling.helper');
const { verifyToken } = require('../helpers/auth.helper');

const sellingApi = Router();

sellingApi
  .route('/')
  .post(verifyToken(['consultant']), async (req, res, next) => {
    const pieces = req.body;
    try {
      const newSelling = await createSelling(req.user.id, pieces);
      res.status(200).json(newSelling);
    } catch (err) {
      return next(err);
    }
  })
  .get(
    verifyToken(['admin', 'supervisor', 'consultant']),
    async (req, res, next) => {
      try {
        const sellings = await handleGetFilters(req.query, SellingModel);
        res.status(200).json(sellings);
      } catch (e) {
        next(e);
      }
    }
  )
  .delete(verifyToken(['admin', 'supervisor']), async (req, res, next) => {
    try {
      const result = await deleteSelling(req.query.id);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  });

module.exports = { sellingApi };
