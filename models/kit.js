// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require('./user');


var kitSchema = new Schema({
	consultora: {
		type: ObjectId,		
        required: true,
        ref: 'User'
	},
	valor: {
		type: Number,
		required: true,
		default: 0
    },
    status: {
        type: String,
        required: true,
        default: "Pendente"
    },
	pecas: [String]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Kit = mongoose.model('Kit', kitSchema);

// make this available to our Node applications
module.exports = Kit;