const { UserModel } = require('../models/user.model');
const { PieceTransactionModel } = require('../models/pieceTransaction.model');
const { ConsultantModel } = require('../models/consultant.model');
const { SupervisorModel } = require('../models/supervisor.model');
const { StockistModel } = require('../models/stockist.model');
const { subtractStocks, sumStocks } = require('./stock.helper');
const { startSession } = require('mongoose');
const { RequestModel } = require('../models/request.model');

const roleModels = {
  consultant: ConsultantModel,
  supervisor: SupervisorModel,
  stockist: StockistModel
};

const createPieceTransaction = async (
  senderId,
  receiverId,
  receiverRole,
  pieces,
  request
) => {
  const SenderUser = await UserModel.findById(senderId);
  if (!(SenderUser.currentRole in roleModels)) {
    const error = new Error('senderRole.invalid');
    error.status = 400;
    throw error;
  }
  const Sender = await roleModels[SenderUser.currentRole].findOne({
    user: senderId
  });
  if (!Sender) {
    const error = new Error('sender.notFound');
    error.status = 404;
    throw error;
  }

  if (!(receiverRole in roleModels)) {
    const error = new Error('receiverRole.invalid');
    error.status = 400;
    throw error;
  }
  const Receiver = await roleModels[receiverRole].findOne({ user: receiverId });
  if (!Receiver) {
    const error = new Error('receiver.notFound');
    error.status = 404;
    throw error;
  }

  const subtractionResult = subtractStocks(Sender.stock, pieces);

  if (subtractionResult.status === 'missing') {
    const error = new Error('transaction.missingPieces');
    error.status = 400;
    error.data = subtractionResult.result;
    throw error;
  }

  const selectedRequest = request
    ? await RequestModel.findById(request)
    : undefined;
  if (request) {
    if (!selectedRequest) {
      const error = new Error('request.notFound');
      error.status = 404;
      throw error;
    }
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

    if (selectedRequest) {
      selectedRequest.status = 'sent';
      await selectedRequest.save();
    }

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
    const error = new Error('transaction.notFound');
    error.status = 404;
    throw error;
  }
  const Receiver = await roleModels[transaction.receiverRole].findOne({
    user: transaction.receiver
  });
  if (!Receiver) {
    const error = new Error('receiver.notFound');
    error.status = 404;
    throw error;
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
    const error = new Error('sender.notFound');
    error.status = 404;
    throw error;
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
    const error = new Error('receiver.notFound');
    error.status = 404;
    throw error;
  }

  const subtractionResult = subtractStocks(Receiver.stock, transaction.pieces);

  if (subtractionResult.status === 'missing') {
    const error = new Error('transaction.missingPieces');
    error.status = 400;
    error.data = subtractionResult.result;
    throw error;
  }

  const Sender = await roleModels[transaction.senderRole].findOne({
    user: transaction.sender
  });
  if (!Sender) {
    const error = new Error('sender.notFound');
    error.status = 404;
    throw error;
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
    const error = new Error('transaction.notFound');
    error.status = 404;
    throw error;
  }
  if (transaction.status === 'reverted' || transaction.status === 'aborted') {
    const error = new Error(`transaction.${transaction.status}`);
    error.status = 400;
    throw error;
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
      query = query.populate([
        {
          path: 'sender',
          select: 'fullName adress phoneNumber active email'
        },
        {
          path: 'receiver',
          select: 'fullName adress phoneNumber active email'
        }
      ]);
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
