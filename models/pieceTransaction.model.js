const { Schema, model } = require('mongoose');
const { aggregate } = require('../helpers/stock.helper');

const { UserModelName, Roles } = require('./user.model');
const { StockSchema } = require('./common');

const { ObjectId } = Schema.Types;

const PieceTransactionModelName = 'PIECE_TRANSACTION';

const PieceTransactionStatus = ['pending', 'received', 'aborted', 'reverted'];

const PieceTransactionSchema = new Schema(
  {
    status: {
      type: String,
      enum: PieceTransactionStatus,
      default: 'pending'
    },
    sender: {
      type: ObjectId,
      ref: UserModelName,
      required: true
    },
    senderRole: {
      type: String,
      enum: Roles,
      required: true
    },
    receiver: {
      type: ObjectId,
      ref: UserModelName,
      required: true
    },
    receiverRole: {
      type: String,
      enum: Roles,
      required: true
    },
    pieces: {
      type: StockSchema,
      required: true
    },
    receivedAt: Date,
    abortedAt: Date,
    revertedAt: Date
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);

PieceTransactionSchema.virtual('aggregatedPieces').get(function () {
  return aggregate(this.pieces);
});

const PieceTransactionModel = model(
  PieceTransactionModelName,
  PieceTransactionSchema
);

module.exports = {
  PieceTransactionModel,
  PieceTransactionModelName,
  PieceTransactionStatus
};
