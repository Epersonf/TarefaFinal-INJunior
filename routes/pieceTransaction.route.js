const { Router } = require('express');
const { PieceTransactionModel } = require('../models/pieceTransaction.model');
const {
  createPieceTransaction,
  receivePieceTransaction,
  deletePieceTransaction,
  handleGetFilters
} = require('./../helpers/pieceTransaction.helper');
const { verifyToken } = require('../helpers/auth.helper');

const pieceTransactionApi = Router();

pieceTransactionApi
  .route('/')
  .post(
    verifyToken(['stockist', 'supervisor', 'consultant']),
    async (req, res, next) => {
      const { pieces, receiverId, receiverRole, request } = req.body;
      try {
        const newPieceTransaction = await createPieceTransaction(
          req.user.id,
          receiverId,
          receiverRole,
          pieces,
          request
        );
        res.status(200).json(newPieceTransaction);
      } catch (err) {
        return next(err);
      }
    }
  )
  .get(
    verifyToken([
      'admin',
      'controller',
      'supervisor',
      'stockist',
      'consultant'
    ]),
    async (req, res, next) => {
      try {
        const pieceTransactions = await handleGetFilters(
          req.query,
          PieceTransactionModel
        );
        res.status(200).json(pieceTransactions);
      } catch (e) {
        next(e);
      }
    }
  )
  .put(
    verifyToken(['stockist', 'supervisor', 'consultant']),
    async (req, res, next) => {
      try {
        const { status, id } = req.query;
        if (status && status === 'received') {
          const updatedPieceTransaction = await receivePieceTransaction(
            id,
            req.user.id
          );
          res.status(200).json(updatedPieceTransaction);
        } else {
          next(new Error('pieceTransaction.update.error'));
        }
      } catch (e) {
        next(e);
      }
    }
  )
  .delete(
    verifyToken(['stockist', 'supervisor', 'consultant']),
    async (req, res, next) => {
      try {
        const result = await deletePieceTransaction(req.query.id);
        res.status(200).json(result);
      } catch (e) {
        next(e);
      }
    }
  );

module.exports = { pieceTransactionApi };
