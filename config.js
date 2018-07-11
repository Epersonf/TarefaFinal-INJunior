module.exports = {
    'secretKey': '84126-67890-67412-54321',
    //'mongoUrl' : 'mongodb://0.0.0.0:27017/ambaya'
    'mongoUrl' : process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/ambaya'
}
