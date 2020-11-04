const { Router } = require('express');
const { GiftModel } = require('../models/gift.model');
const {
  handleGetFilters,
  takeGift,
  reverseTakeGift
} = require('./../helpers/gift.helper');
const { verifyToken } = require('../helpers/auth.helper');

const giftApi = Router();

giftApi
  .route('/')
  .post(verifyToken(['admin']), async (req, res, next) => {
    try {
      const gift = await GiftModel.create(req.body);
      res.status(200).json(gift);
    } catch (e) {
      next(e);
    }
  })
  .get(
    verifyToken(['admin', 'controller', 'consultant']),
    async (req, res, next) => {
      try {
        const consultants = await handleGetFilters(req.query, GiftModel);
        res.status(200).json(consultants);
      } catch (e) {
        next(e);
      }
    }
  )
  .put(verifyToken(['admin', 'consultant']), async (req, res, next) => {
    const { id } = req.query;
    const { taken, pieces } = req.body;
    const user = req.user;
    try {
      if (id && taken !== undefined) {
        const gift =
          taken === true
            ? await takeGift(id, pieces, user.id)
            : await reverseTakeGift(id);
        res.status(200).json(gift);
      } else {
        const err = new Error('gift.missingParams');
        err.status = 400;
        throw err;
      }
    } catch (e) {
      next(e);
    }
  });

module.exports = { giftApi };
