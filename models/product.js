// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String
    },
    imageId: {
        type: String
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
var Product = mongoose.model('Product', productSchema);

// make this available to our Node applications
module.exports = Product;