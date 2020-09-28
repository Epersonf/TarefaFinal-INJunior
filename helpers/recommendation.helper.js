const { RecomendationModel } = require('../models/recommendation.model');

const handleGetFilters = async (query, Model) => {
  const { id, sort, skip, limit, count, ...otherParams } = query;
  if (id) {
    const instance = await Model.findById(id);
    return instance;
  } else {
    let query = Model.find(otherParams);
    if (count) {
      query = query.count();
    } else {
      sort && (query = query.sort(sort));
      limit && (query = query.limit(Number(limit)));
      skip && (query = query.limit(Number(skip)));
      query = query.populate([
        {
          path: 'recommended',
          select:
            'fullName adress phoneNumber active username email cpf city cep'
        },
        {
          path: 'recommendee',
          select: 'fullName adress phoneNumber active email'
        }
      ]);
    }

    const collection = await query.exec();
    return collection;
  }
};

const writeCheckoutToRecommendation = async (soldValue, userId) => {
  const recommendation = await RecomendationModel.findOne({
    recommended: userId
  });
  if (recommendation) {
    if (recommendation.firstCheckout === undefined) {
      recommendation.firstCheckout = soldValue;
    } else if (recommendation.secondCheckout === undefined) {
      recommendation.secondCheckout = soldValue;
    } else if (recommendation.thirdCheckout === undefined) {
      recommendation.thirdCheckout = soldValue;
    }
    await recommendation.save();
  }
};

module.exports = {
  handleGetFilters,
  writeCheckoutToRecommendation
};
