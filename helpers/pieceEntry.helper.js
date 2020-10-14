const { startSession } = require('mongoose');
const { StockistModel } = require('./../models/stockist.model');
const { PieceEntryModel } = require('./../models/pieceEntry.model');
const { sumStocks, subtractStocks } = require('./stock.helper');

const createPieceEntry = async (user, entry) => {
  const session = await startSession();
  const stockist = await StockistModel.findOne({ user });
  if (!stockist) {
    const error = new Error('stockist.notFound');
    error.status = 404;
    throw error;
  }
  try {
    session.startTransaction();
    const newPieceEntry = await PieceEntryModel.create({ user, entry });
    const newStock = sumStocks(stockist.stock, entry);
    await StockistModel.findOneAndUpdate({ user }, { stock: newStock });
    await session.commitTransaction();
    session.endSession();
    return { newPieceEntry, stockist };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deletePieceEntry = async (userId, entryId) => {
  const session = await startSession();
  const stockist = await StockistModel.findOne({ user: userId });
  const pieceEntry = await PieceEntryModel.findById(entryId);
  if (!stockist) {
    const error = new Error('stockist.notFound');
    error.status = 404;
    throw error;
  }
  if (!pieceEntry) {
    const error = new Error('pieceEntry.notFound');
    error.status = 404;
    throw error;
  }
  const subtraction = subtractStocks(stockist.stock, pieceEntry.entry);
  if (subtraction.status === 'missing') {
    const err = new Error('pieceEntry.missingPieces');
    err.status = 400;
    err.data = subtraction.result;
    throw err;
  }
  try {
    session.startTransaction();
    stockist.stock = subtraction.result;
    pieceEntry.revertedAt = new Date();
    await stockist.save();
    await pieceEntry.save();
    await session.commitTransaction();
    session.endSession();
    return { stock: stockist.stock, pieceEntry };
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
  createPieceEntry,
  deletePieceEntry,
  handleGetFilters
};
