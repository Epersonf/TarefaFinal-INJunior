const { Schema, model } = require('mongoose');
const { aggregate } = require('../helpers/stock.helper');

const { UserModelName } = require('./user.model');
const { StockSchema } = require('./common');

const { ObjectId } = Schema.Types;

const PieceReplacementModelName = 'PIECE_REPLACEMENT';

const PieceReplacementSchema = new Schema(
  {
    seller: {
      type: ObjectId,
      ref: UserModelName,
      required: true
    },
    checkout: {
      type: ObjectId,
      ref: 'CHECKOUT',
      required: true
    },
    newPiece: {
      type: StockSchema,
      required: true
    },
    brokenPiece: {
      type: StockSchema,
      required: true
    },
    difference: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);

PieceReplacementSchema.virtual('aggregatedPieces').get(function () {
  return aggregate(this.pieces);
});

const PieceReplacementModel = model(
  PieceReplacementModelName,
  PieceReplacementSchema
);

module.exports = {
  PieceReplacementModel,
  PieceReplacementModelName
};
