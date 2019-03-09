// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var packItemSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    type: String,
    imageUrl: String,
    pack: { type: ObjectId, ref: 'Pack' }
    }, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var PackItem = mongoose.model('PackItem', packItemSchema);

// make this available to our Node applications
module.exports = PackItem;