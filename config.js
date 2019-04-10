module.exports = {
    'secretKey': '84126-67890-67412-54321',
    'PORT': process.env.PORT || 8080,
    'mongoUrl': process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/ambaya',
    //'mongoUrl': 'mongodb://heroku_47z4qmjw:21t0mlcgsas4bj7asap5c3h5s0@ds127978.mlab.com:27978/heroku_47z4qmjw',
    'CLOUDINARY_URL': process.env.CLOUDINARY_URL || 'cloudinary://279488126232216:4HBKePMxrgMu3AHRWW6KIyLEbUs@hkzbsdu4z',
    'pagseguroEmail': 'ambayasemijoias@gmail.com',
    'pagseguroSandboxToken': '4B600F906F9C49EFA0520D94ADFA1AEE',
    'pagSeguroToken': '5E7E5D7822FB4367BCDF1CCD4188B08A',
    'pagseguroNotificationUrl': 'https://webhook.site/5d6544c8-9b83-422a-a9f6-278f4ad73c68',
    'useSandbox': true
}
