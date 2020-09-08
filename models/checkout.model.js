const { Schema, model } = require('mongoose');
const { aggregate } = require('../helpers/stock.helper');

const { UserModelName } = require('./user.model');
const { StockSchema } = require('./common');
const { emptyStock } = require('../helpers/stock.helper');
const { SellingModelName } = require('./selling.model');
const { PieceReplacementModelName } = require('./pieceReplacement.model');
const { GiftModelName } = require('./gift.model');

const { ObjectId } = Schema.Types;

const CheckoutModelName = 'CHECKOUT';

const checkoutStatus = ['open', 'closed'];

const CheckoutScheme = new Schema(
  {
    user: {
      type: ObjectId,
      ref: UserModelName,
      required: true
    },
    status: {
      type: String,
      enum: checkoutStatus,
      default: 'open'
    },
    sold: {
      type: StockSchema,
      default: emptyStock
    },
    sellings: {
      type: [
        {
          type: ObjectId,
          ref: SellingModelName
        }
      ]
    },
    gifts: {
      type: [
        {
          type: ObjectId,
          ref: GiftModelName
        }
      ]
    },
    replacements: {
      type: [
        {
          type: ObjectId,
          ref: PieceReplacementModelName
        }
      ]
    },
    absoluteSoldBefore: {
      type: Number,
      default: 0
    },
    checkoutDetails: {
      type: String
    },
    closeDate: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);

CheckoutScheme.virtual('aggregatedSold').get(function () {
  return aggregate(this.sold);
});

const CheckoutModel = model(CheckoutModelName, CheckoutScheme);

module.exports = {
  CheckoutModel,
  CheckoutModelName
};
