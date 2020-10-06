const { StockistModel } = require('../models/stockist.model');
const { SupervisorModel } = require('../models/supervisor.model');
const { UserModel } = require('../models/user.model');
const { createNewConsultant } = require('./consultant.helper');

const handleGetFilters = async (query, Model) => {
  const { id, sort, skip, limit, count, inactive, ...otherParams } = query;
  if (id) {
    const instance = await Model.findById(id);
    return instance;
  } else {
    let query = Model.find(otherParams);
    !inactive && (query = query.find({ active: true }));
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

const addRoleToUser = async (user, role) => {
  user.roles.push(role);

  if (role === 'consultant') {
    await createNewConsultant({
      user: user.id,
      fullName: user.fullName
    });
  }

  if (role === 'supervisor') {
    await SupervisorModel.create({
      user: user.id,
      fullName: user.fullName
    });
  }

  if (role === 'stockist') {
    await StockistModel.create({
      user: user.id,
      fullName: user.fullName
    });
  }

  await user.save();

  return user;
};

const updateUser = async (userId, data) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error('user.notFound');
  }
  const { newRole, ...newData } = data;
  let updatedUser;
  if (newRole) {
    updatedUser = await addRoleToUser(user, newRole);
  }
  if (newData) {
    updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: newData },
      { new: true }
    );
  }
  return updatedUser;
};

module.exports = {
  handleGetFilters,
  updateUser
};
