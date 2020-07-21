const { Schema, model } = require('mongoose');
const { aggregate } = require('../helpers/stock.helper');

const { UserModelName } = require('./user.model');
const { StockSchema, emptyStock } = require('./common');

const { ObjectId } = Schema.Types;

const CheckoutModelName = 'CHECKOUT';

// TODO: add a pattern to make it safer
const Replacement = new Schema({
  newPiece: {
    type: String,
    required: true
  },
  brokenPiece: {
    type: String,
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
});

const Gift = new Schema({
  taken: {
    type: Boolean,
    default: false
  },
  piece: {
    type: String
  },
  campaign: {
    type: String,
    required: true
  },
  currentAbsoluteSelling: {
    type: Number,
    required: true
  }
});

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
    replacements: {
      type: [Replacement]
    },
    gifts: {
      type: [Gift]
    },
    income: {
      type: Number
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
