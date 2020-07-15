const { Schema, model } = require('mongoose');
const { aggregate } = require('../helpers/piecesHelper');

const { UserModelName } = require('./user.model');
const { StockSchema, emptyStock } = require('./common');

const { ObjectId } = Schema.Types;

const StockistModelName = 'STOCKIST';

const StockistScheme = new Schema(
  {
    user: {
      type: ObjectId,
      ref: UserModelName,
      required: true
    },
    stock: {
      type: StockSchema,
      default: emptyStock
    },
    city: String,
    state: String,
    adress: String,
    cep: String,
    phoneNumber: String
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);

StockistScheme.virtual('aggregatedStock').get(function () {
  return aggregate(this.stock);
});

const StockistModel = model(StockistModelName, StockistScheme);

module.exports = {
  StockistModel,
  StockistModelName
};
