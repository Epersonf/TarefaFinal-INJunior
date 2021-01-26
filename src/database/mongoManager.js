const mongoose = require('mongoose');

function connectToDatabase(url) {
    mongoose.Promise = global.Promise;
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Connected to MongoDB.");
    }).catch((err) => {
        console.log("Failed connecting to MongoDB.");
    });
}

module.exports = { connectToDatabase };