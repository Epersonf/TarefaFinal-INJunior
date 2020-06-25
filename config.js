const config = {
  appEnv: process.env.APP_ENV || 'test',
  // 'appEnv': process.env.APP_ENV || 'prod',
  secretKey: '84126-67890-67412-54321',
  PORT: process.env.PORT || 8080,
  mongoUrl: process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/ambaya',
  // 'mongoUrl': 'mongodb://albertdm:8xvq9x8z@ds151006-a0.mlab.com:51006,ds151006-a1.mlab.com:51006/heroku_l959zvp6?replicaSet=rs-ds151006',
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME || 'hkzbsdu4z',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '279488126232216',
  CLOUDINARY_API_SECRET:
    process.env.CLOUDINARY_API_SECRET || '4HBKePMxrgMu3AHRWW6KIyLEbUs',
  CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER || 'dev',
  pagseguroEmail: process.env.PAGSEGURO_EMAIL || 'ambayasemijoias@gmail.com',
  pagseguroToken:
    process.env.PAGSEGURO_TOKEN || '4B600F906F9C49EFA0520D94ADFA1AEE',
  // 'pagseguroToken': process.env.PAGSEGURO_TOKEN || '5E7E5D7822FB4367BCDF1CCD4188B08A',
  pagseguroNotificationUrl:
    process.env.PAGSEGURO_WEBHOOK ||
    'https://webhook.site/c989d129-3409-4cc7-b2e3-e605835033c5',
  pagSeguroUrl:
    process.env.PAGSEGURO_URL || 'https://ws.sandbox.pagseguro.uol.com.br'
  // 'pagSeguroUrl': process.env.PAGSEGURO_URL || 'https://ws.pagseguro.uol.com.br',
};

module.exports = { config };
