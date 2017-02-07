// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var solicitacaoSchema = new Schema({
	pessoaId: {
		type: ObjectId,		
        required: true
	},
    item: {
        type: String,
        required: true
    },
	quantidade: {
		type: Number,
		required: true,
		default: 0
	},
	status:{ //Pendente, Enviado, Cancelado...
        type: String,
        required: true,
        default: "Pendente"
    },
    consultor: ObjectId
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Solicitacao = mongoose.model('Solicitacao', solicitacaoSchema);

// make this available to our Node applications
module.exports = Solicitacao;