const { Schema, model } = require('mongoose');

const { UserModelName } = require('./user.model');

const { StockSchema } = require('./common');
const { aggregate } = require('../helpers/stock.helper');

const { ObjectId } = Schema.Types;

const GiftModelName = 'GIFT';

const GiftSchema = new Schema(
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
    taken: {
      type: Boolean,
      default: false
    },
    takenAt: Date,
    piece: {
      type: StockSchema
    },
    campaign: {
      type: String,
      required: true
    },
    currentAbsoluteSelling: {
      type: Number,
      required: true
    },
    description: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

GiftSchema.virtual('aggregatedPiece').get(function () {
  return this.piece ? aggregate(this.piece) : undefined;
});

const GiftModel = model(GiftModelName, GiftSchema);

module.exports = {
  GiftModel,
  GiftModelName
};
