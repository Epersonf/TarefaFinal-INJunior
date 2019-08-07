// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var encomendaSchema = new Schema({
	item: {
		type: String,		
        required: false
	},
    status: {
        type: String,
        required: true,
        default: "Pendente"
    },
    tipo: {
        type: String,
        required: true,
        default: "simples" // simples, enxoval, catalogo
    },
	quantidade: {
		type: Number,
		required: false
	},
	donoNome:{
        type: String,
        required: false
    },
    donoId:{ 
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    pagamento:{
        type: ObjectId,
        ref: 'Acerto'
    },
    consultorNome: String,
    consultorId: ObjectId,
    detalhes: String, 
    shipmentCode: String,
    enviados: [String],
    products: {
        type: [{
            type: ObjectId,
            ref: 'Product'
        }],
    },
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Encomenda = mongoose.model('Encomenda', encomendaSchema);

// make this available to our Node applications
module.exports = Encomenda;