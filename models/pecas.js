// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// create a schema

var pecasSchema = new Schema({
	codigo: {
        type: String,
        required: true
    },
	descriacao: String,
	quantidade: {
        type: Number,
        required: true,
		default: 0
    },
	custo: Number,
	precoVenda: Number,
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Peca = mongoose.model('Peca', pecasSchema);

// make this available to our Node applications
module.exports = Peca;