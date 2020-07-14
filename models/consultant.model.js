const { Schema, model } = require('mongoose');
const { addDays } = require('date-fns');
const { aggregate } = require('../helpers/piecesHelper');

const { UserModelName } = require('./user.model');
const { StockSchema, emptyStock } = require('./common');

const { ObjectId } = Schema.Types;

const ConsultantModelName = 'CONSULTANT';

const ConsultantScheme = new Schema(
  {
    user: {
      type: ObjectId,
      ref: UserModelName,
      required: true
    },
    supervisor: {
      type: ObjectId,
      ref: UserModelName
    },
    stock: {
      type: StockSchema,
      default: emptyStock
    },
    sold: {
      type: StockSchema,
      default: emptyStock
    },
    nextPaymend: {
      type: Date,
      default: addDays(new Date(), 15)
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);

ConsultantScheme.virtual('aggregatedStock').get(function () {
  return aggregate(this.stock);
});

ConsultantScheme.virtual('aggregatedSold').get(function () {
  return aggregate(this.sold);
});

const ConsultantModel = model(ConsultantModelName, ConsultantScheme);

module.exports = {
  ConsultantModel,
  ConsultantModelName
};
