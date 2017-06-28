// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var trocaSchema = new Schema({
	pecaDefeito: {
		type: String,		
        required: true
	},
    pecaNova: {
		type: String,		
        required: true
	},
	consultorId: {
		type: ObjectId,		
        required: true
	},
    consultorNome: {
        type: String,		
        required: true
    },
    defeito: { 
        type: String, //banho ou bruto
        required: true
    },
    saldo: {
        type: Number,
        required: true
    },
    obs: String
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Troca = mongoose.model('Troca', trocaSchema);

// make this available to our Node applications
module.exports = Troca;