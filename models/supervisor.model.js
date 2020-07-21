const { Schema, model } = require('mongoose');
const { aggregate } = require('../helpers/stock.helper');

const { UserModelName } = require('./user.model');
const { StockSchema, emptyStock } = require('./common');

const { ObjectId } = Schema.Types;

const SupervisorLevels = ['simple', 'premium'];

const SupervisorModelName = 'SUPERVISOR';

const SupervisorScheme = new Schema(
  {
    user: {
      type: ObjectId,
      ref: UserModelName,
      required: true
    },
    level: {
      type: String,
      enum: SupervisorLevels,
      defalut: 'simple'
    },
    supervisor: {
      type: ObjectId,
      ref: UserModelName
    },
    stock: {
      type: StockSchema,
      default: emptyStock
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);

SupervisorScheme.virtual('aggregatedStock').get(function () {
  return aggregate(this.stock);
});

const SupervisorModel = model(SupervisorModelName, SupervisorScheme);

module.exports = {
  SupervisorModel,
  SupervisorModelName
};
