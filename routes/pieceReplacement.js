const { Router } = require('express');
const { PieceReplacementModel } = require('../models/pieceReplacement.model');
const {
  createPieceReplacement,
  handleGetFilters
} = require('./../helpers/pieceReplacement.helper');
const { verifyToken } = require('../helpers/auth.helper');

const pieceReplacementApi = Router();

pieceReplacementApi
  .route('/')
  .post(verifyToken(['admin', 'consultant']), async (req, res, next) => {
    const { newPiece, brokenPiece, description } = req.body;
    try {
      if (newPiece && brokenPiece && description) {
        const pieceReplacement = await createPieceReplacement(
          newPiece,
          brokenPiece,
          description,
          req.user.id
        );
        res.status(200).json(pieceReplacement);
      } else {
        const err = new Error('missingParams');
        err.status = 400;
        throw err;
      }
    } catch (e) {
      next(e);
    }
  })
  .get(
    verifyToken(['admin', 'controller', 'consultant']),
    async (req, res, next) => {
      try {
        const consultants = await handleGetFilters(
          req.query,
          PieceReplacementModel
        );
        res.status(200).json(consultants);
      } catch (e) {
        next(e);
      }
    }
  );

module.exports = { pieceReplacementApi };