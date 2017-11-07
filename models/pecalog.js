// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require('./user');


var pecalogSchema = new Schema({
	acao: {
		type: String,		
        required: true
    },
    user: {
        type: ObjectId,
        required: false,
        ref: 'User'
    },
    pecas: [String]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var PecaLog = mongoose.model('PecaLog', pecalogSchema);

// make this available to our Node applications
module.exports = PecaLog;