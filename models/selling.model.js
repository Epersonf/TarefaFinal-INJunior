const { Schema, model } = require('mongoose');
const { aggregate } = require('../helpers/stock.helper');

const { UserModelName } = require('./user.model');
const { StockSchema } = require('./common');
const { CheckoutModelName } = require('./checkout.model');

const { ObjectId } = Schema.Types;

const SellingModelName = 'SELLING';

const SellingSchema = new Schema(
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
    pieces: {
      type: StockSchema,
      required: true
    },
    revertedAt: Date
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);

SellingSchema.virtual('aggregatedPieces').get(function () {
  return aggregate(this.pieces);
});

const SellingModel = model(SellingModelName, SellingSchema);

module.exports = {
  SellingModel,
  SellingModelName
};
