// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// create a schema
var consultorSchema = new Schema({
    nome:{
		type: String,
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
	status:{
		type: String,
		required: true,
		default: "Pendente"
	},
	vendido:{
		type: Number,
		required: true,
		default: 0
	},
	pecas: [String],
	pecasVendidas: [String],
	proxAcerto:{
		type: Date,
		required: true,
		default: new Date(+new Date() + 45*24*60*60*1000)
	}
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Consultor = mongoose.model('Consultor', consultorSchema);

// make this available to our Node applications
module.exports = Consultor;