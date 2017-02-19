// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var encomendaSchema = new Schema({
	item: {
		type: String,		
        required: true
	},
    status: {
        type: String,
        required: true,
        default: "Pendente"
    },
	quantidade: {
		type: Number,
		required: true
	},
	donoNome:{
        type: String,
        required: true
    },
    donoId:{ 
        type: ObjectId,
        required: true
    },
    consultorNome: String,
    consultorId: ObjectId,
    detalhes: String
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Encomenda = mongoose.model('Encomenda', encomendaSchema);

// make this available to our Node applications
module.exports = Encomenda;