module.exports = {
    'secretKey': '84126-67890-67412-54321',
    'PORT': process.env.PORT || 8080,
    'mongoUrl' : process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/ambaya',
    //'mongoUrl' : 'mongodb://heroku_47z4qmjw:21t0mlcgsas4bj7asap5c3h5s0@ds127978.mlab.com:27978/heroku_47z4qmjw',
    'CLOUDINARY_URL': process.env.CLOUDINARY_URL || 'cloudinary://279488126232216:4HBKePMxrgMu3AHRWW6KIyLEbUs@hkzbsdu4z'
}
