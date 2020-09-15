const { UserModel } = require('../models/user.model');
const { PieceTransactionModel } = require('../models/pieceTransaction.model');
const { ConsultantModel } = require('../models/consultant.model');
const { SupervisorModel } = require('../models/supervisor.model');
const { StockistModel } = require('../models/stockist.model');
const { subtractStocks, sumStocks } = require('./stock.helper');
const { startSession } = require('mongoose');

const roleModels = {
  consultant: ConsultantModel,
  supervisor: SupervisorModel,
  stockist: StockistModel
};

const createPieceTransaction = async (
  senderId,
  receiverId,
  receiverRole,
  pieces
) => {
  const SenderUser = await UserModel.findById(senderId);
  if (!(SenderUser.currentRole in roleModels)) {
    throw new Error('senderRole.invalid');
  }
  const Sender = await roleModels[SenderUser.currentRole].findOne({
    user: senderId
  });
  if (!Sender) {
    throw new Error('sender.notFound');
  }

  if (!(receiverRole in roleModels)) {
    throw new Error('receiverRole.invalid');
  }
  const Receiver = await roleModels[receiverRole].findOne({ user: receiverId });
  if (!Receiver) {
    throw new Error('receiver.notFound');
  }

  const subtractionResult = subtractStocks(Sender.stock, pieces);

  if (subtractionResult.status === 'missing') {
    throw new Error('transaction.missingPieces');
  }

  const session = await startSession();
  try {
    session.startTransaction();
    const newTransaction = await PieceTransactionModel.create({
      sender: senderId,
      senderRole: SenderUser.currentRole,
      receiver: receiverId,
      receiverRole,
      pieces
    });
    Sender.stock = subtractionResult.result;
    await Sender.save();
    await session.commitTransaction();
    session.endSession();
    return { newTransaction, newStock: subtractionResult.result };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const receivePieceTransaction = async (transactionId) => {
  const transaction = await PieceTransactionModel.findById(transactionId);
  if (!transaction) {
    throw new Error('transaction.notFound');
  }
  const Receiver = await roleModels[transaction.receiverRole].findOne({
    user: transaction.receiver
  });
  if (!Receiver) {
    throw new Error('receiver.notFound');
  }

  const session = await startSession();
  try {
    session.startTransaction();
    const stockSum = sumStocks(Receiver.stock, transaction.pieces);
    await roleModels[transaction.receiverRole].findOneAndUpdate(
      {
        user: transaction.receiver
      },
      { stock: stockSum }
    );
    transaction.status = 'received';
    transaction.receivedAt = new Date();
    await transaction.save();
    await session.commitTransaction();
    session.endSession();
    return { transaction, newStock: stockSum };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const abortPieceTransaction = async (transaction) => {
  const Sender = await roleModels[transaction.senderRole].findOne({
    user: transaction.sender
  });
  if (!Sender) {
    throw new Error('sender.notFound');
  }

  const session = await startSession();
  try {
    session.startTransaction();
    const stockSum = sumStocks(Sender.stock, transaction.pieces);
    transaction.status = 'aborted';
    transaction.abortedAt = new Date();
    await roleModels[transaction.senderRole].findOneAndUpdate(
      {
        user: transaction.sender
      },
      { stock: stockSum }
    );
    await transaction.save();
    await session.commitTransaction();
    session.endSession();
    return { transaction, newStock: stockSum };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const revertPieceTransaction = async (transaction) => {
  const Receiver = await roleModels[transaction.receiverRole].findOne({
    user: transaction.receiver
  });
  if (!Receiver) {
    throw new Error('receiver.notFound');
  }

  const subtractionResult = subtractStocks(Receiver.stock, transaction.pieces);

  if (subtractionResult.status === 'missing') {
    throw new Error('transaction.missingPieces');
  }

  const Sender = await roleModels[transaction.senderRole].findOne({
    user: transaction.sender
  });
  if (!Sender) {
    throw new Error('sender.notFound');
  }
  const session = await startSession();
  try {
    session.startTransaction();
    await roleModels[transaction.receiverRole].findOneAndUpdate(
      {
        user: transaction.receiver
      },
      { stock: subtractionResult.result }
    );
    await roleModels[transaction.senderRole].findOneAndUpdate(
      {
        user: transaction.sender
      },
      { stock: sumStocks(Sender.stock, transaction.pieces) }
    );
    transaction.status = 'reverted';
    transaction.revertedAt = new Date();
    await transaction.save();
    await session.commitTransaction();
    session.endSession();
    return { transaction, newStock: Sender.stock };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deletePieceTransaction = async (transactionId) => {
  const transaction = await PieceTransactionModel.findById(transactionId);
  if (!transaction) {
    throw new Error('transaction.notFound');
  }
  if (transaction.status === 'reverted' || transaction.status === 'aborted') {
    throw new Error(`transaction.${transaction.status}`);
  }
  if (transaction.status === 'received') {
    return await revertPieceTransaction(transaction);
  } else {
    return await abortPieceTransaction(transaction);
  }
};

const handleGetFilters = async (query, Model) => {
  const { id, skip, limit, count, ...otherParams } = query;
  const sort = query.sort ? query.sort : '-createdAt';
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
  createPieceTransaction,
  receivePieceTransaction,
  abortPieceTransaction,
  revertPieceTransaction,
  deletePieceTransaction,
  handleGetFilters
};