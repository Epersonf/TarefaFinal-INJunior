// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// create a schema

var pecaSchema = new Schema({
	codigo: {
        type: String,
        required: true
    },
	quantidade: {
        type: Number,
        required: true
    },
	vendidas: {
        type: Number,
        required: true,
		default: 0
    }
});

var kitSchema = new Schema({
	proprietario: {
		type: ObjectId,		
        required: true
	},
    status: { //ativo, inativo, aguardando
        type: String,
        required: true,
		default: "aguardando"
    },
    dataAbertura: {
        type: Date,
        required: true
    },
	dataFechamento: {
        type: Date,
        required: true
    },
	dataPrevista: {
        type: Date,
        required: true
    },
	status: { //pendente, fechado, aberto
        type: String,
        required: true
    }, 
	pecas: [pecaSchema]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Kit = mongoose.model('Kit', kitSchema);

// make this available to our Node applications
module.exports = Kit;