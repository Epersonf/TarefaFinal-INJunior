// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var PackSchema = new Schema({
    title: String,
    description: String,
    coverImage: String,
    status: {
        type: String,
        enum: ["pending", "active", "finished"]
    },
    items: [{ type: ObjectId, ref: 'PackItem' }]
    }, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Pack = mongoose.model('Pack', PackSchema);

// make this available to our Node applications
module.exports = Pack;