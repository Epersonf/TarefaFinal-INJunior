// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var acertoSchema = new Schema({
	userNome: {
		type: String,		
        required: true
	},
	userId: {
		type: ObjectId,		
        required: true
	},
    tipo: { //tipo de usuário
        type: String,
        required: true
    },
	valor: {
		type: Number,
		required: true,
		default: 0
	},
	pago: {
		type: Number,
		required: true,
		default: 0
	},
	taxa: Number,
	boletoUrl: String,
	boletoCode: String,
	transactionId: Number,
	status: String,
	boletoExpirationDate: Date,
	pecas: [String], //pecas vendidas no caso de consultores
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Acerto = mongoose.model('Acerto', acertoSchema);

// make this available to our Node applications
module.exports = Acerto;