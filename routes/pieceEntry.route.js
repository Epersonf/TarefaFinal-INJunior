const { Router } = require('express');
const { PieceEntryModel } = require('../models/pieceEntry.model');
const {
  handleGetFilters,
  createPieceEntry,
  deletePieceEntry
} = require('./../helpers/pieceEntry.helper');
const { verifyToken } = require('../helpers/auth.helper');

const pieceEntryApi = Router();

pieceEntryApi
  .route('/')
  .post(verifyToken(['stockist']), async (req, res, next) => {
    const entry = req.body;
    try {
      const newPieceEntry = await createPieceEntry(req.user.id, entry);
      res.status(200).json(newPieceEntry);
    } catch (err) {
      return next(err);
    }
  })
  .get(verifyToken(['stockist']), async (req, res, next) => {
    try {
      const consultants = await handleGetFilters(req.query, PieceEntryModel);
      res.status(200).json(consultants);
    } catch (e) {
      next(e);
    }
  })
  .delete(verifyToken(['stockist']), async (req, res, next) => {
    try {
      const result = await deletePieceEntry(req.user.id, req.query.id);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  });

module.exports = { pieceEntryApi };
