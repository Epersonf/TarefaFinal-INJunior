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

module.exports = {
  createNewConsultant
};
