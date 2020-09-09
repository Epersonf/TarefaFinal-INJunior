const { GiftModelName } = require('../models/gift.model');

const giftCampaings = [
  {
    name: 'mil',
    goalValue: 1000,
    accumulative: true,
    maxQuantity: undefined
  },
  {
    name: 'maleta',
    goalValue: 2000,
    accumulative: false,
    maxQuantity: 1
  },
  {
    name: 'maletaGrande',
    goalValue: 5000,
    accumulative: false,
    maxQuantity: 1
  }
];

// TODO: fix it,
const checkForGifts = async (totalSoldBefore, soldNow, user) => {
  return giftCampaings.reduce(async (giftsToGetP, campaing) => {
    const giftsToGet = await giftsToGetP;
    const accumulatedGifts =
      Math.floor(soldNow / campaing.goalValue) -
      Math.floor(totalSoldBefore / campaing.goalValue);
    const totalGifts =
      accumulatedGifts > 0 ? (campaing.accumulative ? accumulatedGifts : 1) : 0;
    if (totalGifts === 0) {
      return giftsToGet;
    }
    if (campaing.maxQuantity) {
      const totalTaken = await GiftModelName.find({
        user,
        campaing: campaing.name
      }).count();
      const totalToGenerate =
        totalTaken < campaing.maxQuantity
          ? totalGifts - totalTaken > campaing.maxQuantity
            ? campaing.maxQuantity
            : totalGifts - totalTaken
          : 0;
      const campaingGiftsToGet = Array(totalToGenerate).fill(campaing.name);
      return [...giftsToGet, ...campaingGiftsToGet];
    } else {
      const campaingGiftsToGet = Array(totalGifts).fill(campaing.name);
      return [...giftsToGet, ...campaingGiftsToGet];
    }
  }, Promise.resolve([]));
};

const checkGiftsForCampaing = (campaing, soldBefore, soldNow, maxAvailable) => {
  const inicialGiftNumber =
    Math.floor(soldNow / campaing.goalValue) -
    Math.floor(soldBefore / campaing.goalValue);
  const giftNumber =
    inicialGiftNumber > 0
      ? campaing.accumulative
        ? inicialGiftNumber
        : 1
      : inicialGiftNumber;
  return maxAvailable
    ? giftNumber > maxAvailable
      ? maxAvailable
      : giftNumber
    : giftNumber;
};

module.exports = {
  giftCampaings,
  checkGiftsForCampaing,
  checkForGifts
};
