const { GiftModel } = require('../models/gift.model');
const { ConsultantModel } = require('../models/consultant.model');
const { CheckoutModel } = require('./../models/checkout.model');
const { subtractStocks, sumStocks } = require('./stock.helper');
const { startSession } = require('mongoose');
const { RequestModel } = require('../models/request.model');

const giftCampaings = [
  {
    name: 'mil',
    goalValue: 1000,
    accumulative: true,
    type: 'pieceTake',
    maxQuantity: undefined
  },
  {
    name: 'maleta',
    goalValue: 1500,
    accumulative: false,
    type: 'request',
    maxQuantity: 1
  },
  {
    name: 'maletaGrande',
    goalValue: 5000,
    accumulative: false,
    type: 'request',
    maxQuantity: 1
  }
];

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
    }

    const collection = await query.exec();
    return collection;
  }
};

const takeGift = async (giftId, pieces, userId) => {
  const consultant = await ConsultantModel.findOne({ user: userId });
  if (!consultant) {
    const err = new Error('consultant.notfound');
    err.status = 400;
    throw err;
  }

  const openCheckout = await CheckoutModel.findOne({
    user: userId,
    status: 'open'
  });
  if (!openCheckout) {
    const err = new Error('openCheckout.notfound');
    err.status = 400;
    throw err;
  }

  const gift = await GiftModel.findById(giftId);
  if (!gift) {
    const err = new Error('gift.notfound');
    err.status = 400;
    throw err;
  }
  if (gift.taken) {
    const err = new Error('gift.taken');
    err.status = 400;
    throw err;
  }

  const campaing = giftCampaings.find((c) => c.name === gift.campaign);
  if (!campaing) {
    const err = new Error('campaing.notfound');
    err.status = 400;
    throw err;
  }

  let stockSubtraction;
  if (campaing.type === 'pieceTake') {
    stockSubtraction = subtractStocks(consultant.stock, pieces);
    if (stockSubtraction.status === 'missing') {
      const err = new Error('missingPieces');
      err.status = 400;
      err.data = stockSubtraction.result;
      throw err;
    }
  }

  const session = await startSession();
  try {
    session.startTransaction();
    gift.taken = true;
    gift.takenAt = new Date();
    if (campaing.type === 'pieceTake') {
      gift.piece = pieces;
      gift.markModified('piece');
    }
    if (campaing.type === 'request') {
      await RequestModel.create({
        status: 'approved',
        requester: consultant.user,
        receiver: consultant.user,
        receiverRole: 'consultant',
        description: `Brinde: ${campaing.name}`
      });
    }
    await gift.save();

    if (campaing.type === 'pieceTake') {
      consultant.stock = stockSubtraction.result;
      consultant.markModified('stock');
      await consultant.save();
    }

    await session.commitTransaction();
    session.endSession();
    return gift;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const reverseTakeGift = async (giftId) => {
  const gift = await GiftModel.findById(giftId);
  if (!gift) {
    const err = new Error('gift.notfound');
    err.status = 400;
    throw err;
  }
  if (!gift.taken) {
    const err = new Error('gift.notTaken');
    err.status = 400;
    throw err;
  }
  if (!gift.piece) {
    const err = new Error('gift.noPiecesToRevert');
    err.status = 400;
    throw err;
  }

  const consultant = await ConsultantModel.findOne({ user: gift.seller });
  if (!consultant) {
    const err = new Error('consultant.notfound');
    err.status = 400;
    throw err;
  }

  const campaing = giftCampaings.find((c) => c.name === gift.campaign);
  if (!campaing) {
    const err = new Error('campaing.notfound');
    err.status = 400;
    throw err;
  }

  const newStock = sumStocks(consultant.stock, gift.piece);

  const session = await startSession();
  try {
    session.startTransaction();
    gift.taken = false;
    gift.takenAt = new Date();
    gift.piece = undefined;
    gift.markModified('pieces');
    await gift.save();

    consultant.stock = newStock;
    consultant.markModified('stock');
    await consultant.save();

    await session.commitTransaction();
    session.endSession();
    return gift;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  giftCampaings,
  checkGiftsForCampaing,
  handleGetFilters,
  takeGift,
  reverseTakeGift
};
