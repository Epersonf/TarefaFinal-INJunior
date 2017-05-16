// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var equipamentoSchema = new Schema({
	nome: {
		type: String,		
        required: true
	},
    local: {
		type: String,		
        required: true,
        default: "Não definido"
	},
    status: {
		type: String,		
        required: true,
        default: "Desligado"
	},
    potencia: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Equipamento = mongoose.model('Equipamento', equipamentoSchema);

// make this available to our Node applications
module.exports = Equipamento;