const { Router } = require('express');
const { GiftModel } = require('../models/gift.model');
const { handleGetFilters, takeGift } = require('./../helpers/gift.helper');
const { verifyToken } = require('../helpers/auth.helper');

const giftApi = Router();

giftApi
  .route('/')
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
      if (id && taken) {
        const gift = await takeGift(id, pieces, user.id);
        res.status(200).json(gift);
      } else {
        const err = new Error('missingParams');
        err.status = 400;
        throw err;
      }
    } catch (e) {
      next(e);
    }
  });

module.exports = { giftApi };
