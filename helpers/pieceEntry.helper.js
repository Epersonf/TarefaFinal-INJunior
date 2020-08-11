const { startSession } = require('mongoose');
const { StockistModel } = require('./../models/stockist.model');
const { PieceEntryModel } = require('./../models/pieceEntry.model');
const { sumStocks } = require('./stock.helper');

const createPieceEntry = async (user, entry) => {
  const session = await startSession();
  const stockist = await StockistModel.findOne({ user });
  if (!stockist) {
    throw new Error('Stockist not found');
  }
  try {
    session.startTransaction();
    const newPieceEntry = await PieceEntryModel.create({ user, entry });
    stockist.stock = sumStocks(stockist.stock, entry);
    await stockist.save();
    await session.commitTransaction();
    session.endSession();
    return { newPieceEntry, stockist };
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
  handleGetFilters
};
