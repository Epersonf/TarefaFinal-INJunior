// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// create a schema

var fornecedorSchema = new Schema({
	data: {
		type: Date,		
        required: true,
		default: Date.now
	},
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
});

// the schema is useless so far
// we need to create a model using it
var Fornecedor = mongoose.model('Fornecedor', fornecedorSchema);

// make this available to our Node applications
module.exports = Fornecedor;