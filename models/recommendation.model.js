const { Schema, model } = require('mongoose');

const { UserModelName } = require('./user.model');

const { ObjectId } = Schema.Types;

const RecommendationModelName = 'RECOMMENDATION';

const RecommendationScheme = new Schema(
  {
    recommendee: {
      type: ObjectId,
      ref: UserModelName,
      required: true
    },
    recommended: {
      type: ObjectId,
      ref: UserModelName,
      required: true
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open'
    },
    firstCheckout: {
      type: Number
    },
    secondCheckout: {
      type: Number
    },
    thirdCheckout: {
      type: Number
    },
    currentlyReceived: [
      {
        type: String,
        enum: ['first', 'second', 'third']
      }
    ]
  },
  {
    timestamps: true
  }
);

const RecomendationModel = model(RecommendationModelName, RecommendationScheme);

module.exports = {
  RecomendationModel,
  RecommendationModelName
};
