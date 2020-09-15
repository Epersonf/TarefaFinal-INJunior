const { ConsultantModel } = require('../models/consultant.model');
const { CheckoutModel } = require('../models/checkout.model');
const { subtractStocks, aggregate } = require('./stock.helper');
const { startSession } = require('mongoose');
const { PieceReplacementModel } = require('../models/pieceReplacement.model');

const createPieceReplacement = async (
  newPiece,
  brokenPiece,
  description,
  userId
) => {
  const consultant = await ConsultantModel.findOne({ user: userId });
  if (!consultant) {
    const err = new Error('consultant.notfound');
    err.status = 400;
    throw err;
  }

  const openCheckout = await CheckoutModel.findOne({
    user: userId,
    status: 'open'
  });
  if (!openCheckout) {
    const err = new Error('openCheckout.notfound');
    err.status = 400;
    throw err;
  }

  const stockSubtraction = subtractStocks(consultant.stock, newPiece);
  if (stockSubtraction.status === 'missing') {
    const err = new Error('missingPieces');
    err.status = 400;
    err.data = stockSubtraction.result;
    throw err;
  }

  const aggregatedNewPieces = aggregate(newPiece);
  const aggregatedBrokenPieces = aggregate(brokenPiece);

  const difference =
    aggregatedNewPieces.total.price - aggregatedBrokenPieces.total.price;

  const session = await startSession();
  try {
    session.startTransaction();
    const pieceReplacement = await PieceReplacementModel.create({
      seller: consultant,
      newPiece,
      brokenPiece,
      description,
      difference,
      checkout: openCheckout
    });

    openCheckout.replacements = [
      ...openCheckout.replacements,
      pieceReplacement
    ];
    openCheckout.markModified('replacements');
    await openCheckout.save();

    consultant.stock = stockSubtraction.result;
    consultant.markModified('stock');
    if (difference > 0) {
      consultant.totalSold = consultant.totalSold + difference;
      consultant.markModified('totalSold');
    }
    await consultant.save();

    await session.commitTransaction();
    session.endSession();
    return;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const handleGetFilters = async (query, Model) => {
  const { id, sort, skip, limit, count, ...otherParams } = query;
  if (id) {
    const instance = await Model.findById(id);
    return instance;
  } else {
    let query = Model.find(otherParams);
    if (count) {
      query = query.count();
    } else {
      sort && (query = query.sort(sort));
      limit && (query = query.limit(Number(limit)));
      skip && (query = query.limit(Number(skip)));
    }

    const collection = await query.exec();
    return collection;
  }
};

module.exports = {
  createPieceReplacement,
  handleGetFilters
};
