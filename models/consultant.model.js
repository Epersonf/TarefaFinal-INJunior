const { Schema, model } = require('mongoose');
const { addDays } = require('date-fns');
const { aggregate } = require('../helpers/piecesHelper');

const { UserModelName } = require('./user.model');
const { StockSchema, emptyStock } = require('./common');

const { ObjectId } = Schema.Types;

const ConsultantLevels = ['bronze', 'silver', 'gold'];

const ConsultantModelName = 'CONSULTANT';

const ConsultantScheme = new Schema(
  {
    user: {
      type: ObjectId,
      ref: UserModelName,
      required: true
    },
    approved: {
      type: Boolean,
      default: false
    },
    level: {
      type: String,
      enum: ConsultantLevels,
      defalut: 'bronze'
    },
    supervisor: {
      type: ObjectId,
      ref: UserModelName
    },
    stock: {
      type: StockSchema,
      default: emptyStock
    },
    nextPaymend: {
      type: Date,
      default: addDays(new Date(), 45)
    },
    totalSold: {
      type: Number,
      default: 0
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

const ConsultantModel = model(ConsultantModelName, ConsultantScheme);

module.exports = {
  ConsultantModel,
  ConsultantModelName
};
