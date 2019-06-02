// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var collectionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Active', 'Ended', 'Canceled'],
        default: 'Pending'
    },
    products: {
        type: [{
            type: ObjectId,
            ref: 'Product'
        }],
    },
    image: {
        type: String
    },
    imageId: {
        type: String
    },
    activationDate: {
        type: Date,
    },
    expirationDate: {
        type: Date,
    },
    features: {
        type: [String]
    },
    tags: {
        type: [{
            type: ObjectId,
            ref: 'Tag'
        }],
    }
}, {
        timestamps: true
    });

// the schema is useless so far
// we need to create a model using it
var Collection = mongoose.model('Collection', collectionSchema);

// make this available to our Node applications
module.exports = Collection;