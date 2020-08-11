const { Schema, model } = require('mongoose');
const { aggregate } = require('../helpers/stock.helper');

const { UserModelName } = require('./user.model');
const { StockSchema } = require('./common');

const { ObjectId } = Schema.Types;

const PieceEntryModelName = 'PIECE_EMTRY';

const PieceEntrySchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: UserModelName,
      required: true
    },
    entry: {
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

PieceEntrySchema.virtual('aggregatedEntry').get(function () {
  return aggregate(this.entry);
});

const PieceEntryModel = model(PieceEntryModelName, PieceEntrySchema);

module.exports = {
  PieceEntryModel,
  PieceEntryModelName
};
