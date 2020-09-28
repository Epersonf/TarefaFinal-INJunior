require('dotenv/config');

const config = {
  appEnv: process.env.NODE_ENV || 'test',
  PORT: process.env.PORT || 8080,
  mongoUrl: process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/ambaya',
  secretKey:
    process.env.SECRET_KEY ||
    'F64540B4C8975BC1BEC9D954C7AAA3F3699B8A91E1B09E6AB21DD37EF1A46E02',
  appUrl: process.env.APP_URL || 8080
};

module.exports = { config };
