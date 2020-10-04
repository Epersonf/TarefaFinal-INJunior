const { UserModel } = require('./models/user.model');

const adminData = {
  fullName: 'Admin',
  username: 'admin',
  password: '2014Ambaya2019',
  email: 'ambayasemijoias@gmail.com',
  active: true,
  roles: ['admin'],
  currentRole: 'admin'
};

const checkForAdminUser = async () => {
  const admin = await UserModel.findOne({ username: 'admin' });
  if (!admin) {
    console.log('Creating admin user');
    await UserModel.register(new UserModel(adminData), adminData.password);
    console.log('Admin user created!');
  }
};

module.exports = {
  checkForAdminUser
};
