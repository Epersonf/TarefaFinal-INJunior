module.exports = {
    'secretKey': '84126-67890-67412-54321',
    'PORT': process.env.PORT || 8080,
    'mongoUrl': process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/ambaya',
    //'mongoUrl': 'mongodb://albertdm:8xvq9x8z@ds151006-a0.mlab.com:51006,ds151006-a1.mlab.com:51006/heroku_l959zvp6?replicaSet=rs-ds151006',
    'CLOUDINARY_URL': process.env.CLOUDINARY_URL || 'cloudinary://279488126232216:4HBKePMxrgMu3AHRWW6KIyLEbUs@hkzbsdu4z',
    'pagseguroEmail': 'ambayasemijoias@gmail.com',
    'pagseguroSandboxToken': '4B600F906F9C49EFA0520D94ADFA1AEE',
    'pagSeguroToken': '5E7E5D7822FB4367BCDF1CCD4188B08A',
    'pagseguroNotificationUrl': process.env.PAYPAL_WEBHOOK || 'https://webhook.site/88ac3f22-0347-43a2-88b7-48aa4603b890',
    'useSandbox': false
}
