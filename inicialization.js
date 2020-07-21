const { UserModel } = require('./models/user.model');

const adminData = {
  username: 'admin',
  password: '8xvq9x8z',
  email: 'inbox@albert-dm.dev',
  active: true,
  roles: ['admin'],
  currentRole: 'admin'
};

const checkForAdminUser = async () => {
  const admin = await UserModel.findOne({ username: 'admin' });
  if (!admin) {
    console.log('no admin found');
    await UserModel.register(new UserModel(adminData), adminData.password);
  }
};

module.exports = {
  checkForAdminUser
};
