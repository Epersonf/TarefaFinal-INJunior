const { startSession } = require('mongoose');
const { ConsultantModel } = require('./../models/consultant.model');
const { CheckoutModel } = require('./../models/checkout.model');

const createNewConsultant = async (consultantData) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const newConsultant = await ConsultantModel.create(consultantData);
    const newCheckout = await CheckoutModel.create({
      user: newConsultant.user
    });
    await session.commitTransaction();
    session.endSession();
    return { newConsultant, newCheckout };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const handleGetFilters = async (query, Model) => {
  const { id, sort, count, skip, limit, fullName, ...otherParams } = query;
  if (id) {
    const instance = await Model.findById(id);
    return instance;
  } else {
    let query = Model.find({
      ...otherParams,
      fullName: { $regex: fullName || '', $options: 'i' }
    });
    sort && query.sort(sort);
    query.skip(skip ? Number(skip) : 0).limit(20);
    query.populate([
      {
        path: 'user',
        select: 'fullName adress phoneNumber active username email cpf city cep'
      },
      {
        path: 'supervisor',
        select: 'fullName adress phoneNumber active email'
      }
    ]);
    const collection = await query;
    const amount = (count) ? await query.count() : undefined;
    return { count: amount, elements: collection };
  }
};

module.exports = {
  createNewConsultant,
  handleGetFilters
};
