const { CheckoutModel } = require('../models/checkout.model');
const { getConsultantLevelSplits } = require('../helpers/level.helper');
const {
  writeCheckoutToRecommendation
} = require('../helpers/recommendation.helper');
const { RecomendationModel } = require('../models/recommendation.model');
const { startSession } = require('mongoose');
const { ConsultantModel } = require('../models/consultant.model');
const { addDays } = require('date-fns');

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
      query = query.populate({
        path: 'sellings'
      });
      query = query.populate({
        path: 'gifts'
      });
      query = query.populate({
        path: 'replacements'
      });
    }

    const collection = await query.exec();
    return collection;
  }
};

const getReplacementIncome = (replacements) => {
  return replacements.reduce(
    (report, replacement) => {
      return {
        totalReplacements: report.totalReplacements + 1,
        replacementIncome:
          replacement.difference > 0
            ? report.replacementIncome + replacement.difference
            : report.replacementIncome
      };
    },
    {
      totalReplacements: 0,
      replacementIncome: 0
    }
  );
};

const getRecommendationIncome = (openRecommendations) => {
  return openRecommendations.reduce(
    (income, recommendation) => {
      const listFromCurrentRecommendation = [];
      let currentSoldByRecommendations = 0;
      let currentTotalConsultantSplit = 0;
      if (
        recommendation.firstCheckout !== undefined &&
        !recommendation.currentlyReceived.includes('first')
      ) {
        listFromCurrentRecommendation.push({
          recommendedFullName: recommendation.recommended.fullName,
          checkoutOrder: 1,
          soldByRecommended: recommendation.firstCheckout,
          consultantSplit: recommendation.firstCheckout * 0.05
        });
        currentSoldByRecommendations += recommendation.firstCheckout;
        currentTotalConsultantSplit += recommendation.firstCheckout * 0.05;
      }
      if (
        recommendation.secondCheckout !== undefined &&
        !recommendation.currentlyReceived.includes('second')
      ) {
        listFromCurrentRecommendation.push({
          recommendedFullName: recommendation.recommended.fullName,
          checkoutOrder: 1,
          soldByRecommended: recommendation.secondCheckout,
          consultantSplit: recommendation.secondCheckout * 0.05
        });
        currentSoldByRecommendations += recommendation.secondCheckout;
        currentTotalConsultantSplit += recommendation.secondCheckout * 0.05;
      }
      if (
        recommendation.thirdCheckout !== undefined &&
        !recommendation.currentlyReceived.includes('third')
      ) {
        listFromCurrentRecommendation.push({
          recommendedFullName: recommendation.recommended.fullName,
          checkoutOrder: 1,
          soldByRecommended: recommendation.thirdCheckout,
          consultantSplit: recommendation.thirdCheckout * 0.05
        });
        currentSoldByRecommendations += recommendation.thirdCheckout;
        currentTotalConsultantSplit += recommendation.thirdCheckout * 0.05;
      }
      return {
        list: [...income.list, ...listFromCurrentRecommendation],
        totalSoldByRecomendations:
          income.totalSoldByRecomendations + currentSoldByRecommendations,
        totalConsultantSplit:
          income.totalConsultantSplit + currentTotalConsultantSplit
      };
    },
    {
      list: [],
      totalSoldByRecomendations: 0,
      totalConsultantSplit: 0
    }
  );
};

const getCheckoutReport = (checkout, openRecommendations) => {
  const replacements = getReplacementIncome(checkout.replacements);
  const consultantLevelSplits = getConsultantLevelSplits(
    checkout.absoluteSoldBefore,
    checkout.aggregatedSold.total.price + replacements.replacementIncome
  );
  const totalSplit = consultantLevelSplits.reduce((total, level) => {
    return total + level.splitForLevel;
  }, 0);
  const recommendations = getRecommendationIncome(openRecommendations);
  return {
    userFullName: checkout.user.fullName,
    absolutSoldBefore: checkout.absoluteSoldBefore,
    totalSold: checkout.aggregatedSold.total.price,
    replacements,
    consultantLevelSplits,
    totalSplit,
    recommendations,
    checkoutIncome: totalSplit + recommendations.totalConsultantSplit,
    absolutSoldAfter:
      checkout.absoluteSoldBefore +
      replacements.replacementIncome +
      checkout.aggregatedSold.total.price,
    gifts: {
      totalGifts: checkout.gifts.length,
      notTakenGifts: checkout.gifts.filter((gift) => gift.taken !== true)
        .length,
      totalSaved: checkout.gifts.reduce(
        (total, gift) =>
          gift.aggregatedPiece
            ? total + gift.aggregatedPiece.total.price
            : total,
        0
      )
    }
  };
};

const closeCheckout = async (checkoutId) => {
  const checkout = await CheckoutModel.findById(checkoutId)
    .populate('user')
    .populate('gifts')
    .populate('replacements');
  if (!checkout) {
    const error = new Error('checkout.notFound');
    error.status = 404;
    throw error;
  }
  const consultant = await ConsultantModel.findOne({ user: checkout.user.id });
  const recommendations = await RecomendationModel.find({
    recommendee: checkout.user.id,
    status: 'open'
  }).populate('recommendee');

  const checkoutReport = getCheckoutReport(checkout, recommendations);

  if (checkoutReport.gifts.notTakenGifts > 0) {
    const error = new Error('checkout.giftsNotTaken');
    error.status = 400;
    throw error;
  }

  const session = await startSession();
  try {
    session.startTransaction();

    if (recommendations.length > 0) {
      for (let i = 0; i <= recommendations.length - 1; i++) {
        if (
          recommendations[i].thirdCheckout !== undefined &&
          !recommendations[i].currentlyReceived.includes('third')
        ) {
          recommendations[i].currentlyReceived.push('third');
          recommendations[i].status = 'closed';
          await recommendations[i].save();
        } else if (
          recommendations[i].secondCheckout !== undefined &&
          !recommendations[i].currentlyReceived.includes('second')
        ) {
          recommendations[i].currentlyReceived.push('second');
          await recommendations[i].save();
        } else if (
          recommendations[i].firstCheckout !== undefined &&
          !recommendations[i].currentlyReceived.includes('first')
        ) {
          recommendations[i].currentlyReceived.push('first');
          await recommendations[i].save();
        }
      }
    }

    await writeCheckoutToRecommendation(
      checkoutReport.totalSold + checkoutReport.replacements.replacementIncome,
      checkout.user.id
    );

    consultant.nextPayment = addDays(new Date(), 45);
    consultant.markModified('nextPayment');
    await consultant.save();

    checkout.status = 'closed';
    checkout.closeDate = new Date();
    checkout.reportOnClose = checkoutReport;
    await checkout.save();

    const newCheckout = await CheckoutModel.create({
      user: checkout.user.id,
      absoluteSoldBefore: checkoutReport.absolutSoldAfter
    });

    await session.commitTransaction();
    session.endSession();
    return newCheckout;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  getRecommendationIncome,
  handleGetFilters,
  closeCheckout,
  getCheckoutReport
};
