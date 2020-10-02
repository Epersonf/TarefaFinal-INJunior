const { startSession } = require('mongoose');
const { SellingModel } = require('./../models/selling.model');
const { ConsultantModel } = require('./../models/consultant.model');
const { CheckoutModel } = require('./../models/checkout.model');
const { GiftModel } = require('./../models/gift.model');
const { sumStocks, subtractStocks, aggregate } = require('./stock.helper');
const { getConsultantLevel } = require('./level.helper');
const { giftCampaings, checkGiftsForCampaing } = require('./gift.helper');

const createSelling = async (user, pieces) => {
  const consultant = await ConsultantModel.findOne({ user });
  if (!consultant) {
    throw new Error('Consultant not found');
  }
  const openCheckout = await CheckoutModel.findOne({ user, status: 'open' });
  if (!openCheckout) {
    throw new Error('Open checkout not found');
  }

  const stockSubtraction = subtractStocks(consultant.stock, pieces);
  if (stockSubtraction.status === 'missing') {
    const err = new Error('missingPieces');
    err.status = 400;
    err.data = stockSubtraction.result;
    throw err;
  }

  const aggregatedPieces = aggregate(pieces);
  const absoluteSold = consultant.totalSold + aggregatedPieces.total.price;

  const consultantLevel = getConsultantLevel(absoluteSold);
  const levelUp = consultantLevel !== consultant.level;

  let giftsToGet = [];

  for (let i = 0; i < giftCampaings.length; i++) {
    let maxAvailable;
    if (giftCampaings[i].maxQuantity) {
      const existingGifs = await GiftModel.find({
        seller: user,
        campaign: giftCampaings[i].name
      }).count();
      if (existingGifs >= giftCampaings[i].maxQuantity) {
        continue;
      } else {
        maxAvailable = giftCampaings[i].maxQuantity - existingGifs;
      }
    }
    const earnedGifts = checkGiftsForCampaing(
      giftCampaings[i],
      consultant.totalSold,
      absoluteSold,
      maxAvailable
    );
    giftsToGet = [
      ...giftsToGet,
      ...Array(earnedGifts).fill(giftCampaings[i].name)
    ];
  }

  const session = await startSession();
  try {
    session.startTransaction();
    const gifts = await Promise.all(
      giftsToGet.map(async (giftCampaing) => {
        return await GiftModel.create({
          seller: user,
          checkout: openCheckout.id,
          campaign: giftCampaing,
          currentAbsoluteSelling: absoluteSold
        });
      })
    );
    const newSelling = await SellingModel.create({
      seller: user,
      checkout: openCheckout.id,
      pieces
    });
    openCheckout.sellings.push(newSelling);
    if (gifts.length > 0) {
      openCheckout.gifts = [...openCheckout.gifts, ...gifts];
      openCheckout.markModified('gifts');
    }
    openCheckout.sold = sumStocks(openCheckout.sold, pieces);
    openCheckout.markModified('sold');
    await openCheckout.save();

    if (levelUp) {
      consultant.level = consultantLevel;
      consultant.markModified('level');
    }
    consultant.totalSold = absoluteSold;
    consultant.stock = stockSubtraction.result;
    consultant.markModified('stock');
    await consultant.save();

    await session.commitTransaction();
    session.endSession();
    return { newLevel: levelUp ? consultantLevel : undefined, newSelling };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deleteSelling = async (sellingId) => {
  const selling = await SellingModel.findById(sellingId);
  if (!selling) {
    const err = new Error('selling.notfound');
    err.status = 400;
    throw err;
  }

  const consultant = await ConsultantModel.findOne({ user: selling.seller });
  if (!consultant) {
    const err = new Error('consultant.notfound');
    err.status = 400;
    throw err;
  }

  const checkout = await CheckoutModel.findById(selling.checkout);
  if (!checkout) {
    const err = new Error('checkout.notfound');
    err.status = 400;
    throw err;
  }
  if (checkout.status !== 'open') {
    const err = new Error('checkout.closed');
    err.status = 400;
    throw err;
  }

  const stockSubtraction = subtractStocks(checkout.sold, selling.pieces);
  if (stockSubtraction.status === 'missing') {
    const err = new Error('checkout.missingPieces');
    err.status = 400;
    throw err;
  }

  const newSoldPieces = stockSubtraction.result;

  const absoluteSold =
    consultant.totalSold - selling.aggregatedPieces.total.price;

  const consultantLevel = getConsultantLevel(absoluteSold);

  const levelDown = consultantLevel !== consultant.level;
  // TODO: deal with gifts

  const session = await startSession();
  try {
    session.startTransaction();
    selling.revertedAt = new Date();
    await selling.save();

    checkout.sold = newSoldPieces;
    checkout.markModified('sold');
    await checkout.save();

    consultant.stock = sumStocks(consultant.stock, selling.pieces);
    consultant.markModified('stock');
    consultant.totalSold = absoluteSold;
    if (levelDown) {
      consultant.level = consultantLevel;
    }
    await consultant.save();

    await session.commitTransaction();
    session.endSession();
    return 'success';
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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

module.exports = {
  createSelling,
  deleteSelling,
  handleGetFilters
};
