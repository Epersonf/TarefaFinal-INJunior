// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// create a schema

var personalizadoSchema = new Schema({
	tipo: {
        type: String,
        required: true
    },
	status: { //encomendado, estoque, entregue, pago
        type: String,
        required: true,
		default: "encomendado"
    },
	texto: {
        type: String,
        required: true
    },
	preco: {
        type: Number,
        required: true
    },
	previsaoEntrega: {
		type: Date,
		required: true
	}
});

var consultorSchema = new Schema({
	pessoaId: {
		type: ObjectId,		
        required: true
	},
    supervisor: {
        type: ObjectId,
        required: true
    },
	porcentagem: {
		type: Number,
		required: true,
		default: 30
	},
	totalPecas: {
		type: Number,
		required: true,
		default: 0
	},
	pecasVendidas: [String]	
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Consultor = mongoose.model('Consultor', consultorSchema);

// make this available to our Node applications
module.exports = Consultor;