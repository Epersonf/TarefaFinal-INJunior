// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// create a schema

var logSchema = new Schema({
    ator: {
        type: String,
        required: true
    },
	objeto: {
        type: String,
        required: true
    },
    acao: {
        type: String,
        required: true
    },
	atorId: {
        type: ObjectId,
        required: true
    },
	objetoId: {
		type: ObjectId,
        required: true
	}
},{
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Log = mongoose.model('Log', logSchema);

// make this available to our Node applications
module.exports = Log;