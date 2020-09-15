const { Schema, model } = require('mongoose');
const { aggregate } = require('../helpers/stock.helper');

const { UserModelName } = require('./user.model');
const { StockSchema } = require('./common');

const { ObjectId } = Schema.Types;

const RequestModelName = 'REQUEST';

const requestStatus = ['pending', 'approved', 'sent', 'canceled'];

const RequestSchema = new Schema(
  {
    status: {
      type: String,
      enum: requestStatus,
      default: 'pending'
    },
    requester: {
      type: ObjectId,
      ref: UserModelName,
      required: true
    },
    receiver: {
      type: ObjectId,
      ref: UserModelName,
      required: true
    },
    pieces: {
      type: StockSchema,
      required: false
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

RequestSchema.virtual('aggregatedPieces').get(function () {
  return this.pieces ? aggregate(this.pieces) : undefined;
});

const RequestModel = model(RequestModelName, RequestSchema);

module.exports = {
  RequestModel,
  RequestModelName
};
