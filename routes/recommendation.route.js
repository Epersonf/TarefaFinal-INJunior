const { Router } = require('express');
const { RecomendationModel } = require('../models/recommendation.model');
const { handleGetFilters } = require('./../helpers/recommendation.helper');
const { verifyToken } = require('../helpers/auth.helper');

const recommendationApi = Router();

recommendationApi
  .route('/')
  .post(async (req, res, next) => {
    const recommendation = req.body;
    try {
      const newRecommendation = await RecomendationModel.create(recommendation);
      res.status(200).json(newRecommendation);
    } catch (err) {
      return next(err);
    }
  })
  .get(async (req, res, next) => {
    try {
      const recommendations = await handleGetFilters(
        req.query,
        RecomendationModel
      );
      res.status(200).json(recommendations);
    } catch (e) {
      next(e);
    }
  })
  .put(
    verifyToken(['admin', 'controller', 'stockist', 'supervisor']),
    async (req, res, next) => {
      const { id } = req.query;
      const recommendation = req.body;
      if (id) {
        try {
          const updatedRecommendation = await RecomendationModel.updateOne(
            { _id: id },
            { $set: recommendation }
          );
          res.status(200).json({
            message: 'recommendation.updated',
            info: updatedRecommendation
          });
        } catch (err) {
          return next(err);
        }
      } else {
        return res.status(400).json({
          message: 'recommendation.missingId'
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
          const updatedRecommendation = await RecomendationModel.updateOne(
            { _id: id },
            { $set: { status: 'canceled' } }
          );
          res.status(200).json({
            message: 'recommendation.canceled',
            info: updatedRecommendation
          });
        } catch (err) {
          return next(err);
        }
      } else {
        return res.status(400).json({
          message: 'recommendation.missingId'
        });
      }
    }
  );

module.exports = { recommendationApi };
