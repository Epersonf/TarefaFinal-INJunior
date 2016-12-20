// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// create a schema
var User = new Schema({
	username: {
		type: String,		
        //required: true,
        unique: true
	},
	passowrd: {
		type: String,		
        //required: true,
	},
	status: { //ativo, inativo, pendente
        type: String,
        //required: true,
		default: "Pendente"
    },
    nome: {
        type: String,
        //required: true
    },
    sobrenome: {
        type: String,
        //required: true
    },
	whatsapp: {
        type: String,
        //required: true
    },
	operadora: {
        type: String,
        //required: true
    },
	nascimento: {
        type: Date,
        //required: true
    },
	cpf: {
        type: String,
        //required: true
    },
	rg: {
        type: String,
        //required: true
    },
	cidade: {
        type: String,
        //required: true
    },
	endereco: {
        type: String,
        //required: true
    },
	cep: {
        type: String,
        //required: true
    },
	tipo: { //supervisor, consultor, controladoria, estoque, 
        type: String,
        //required: true
    },
	sexo: {
		type: String,
		//required: true
	}
}, {
    timestamps: true
});

User.plugin(passportLocalMongoose);

// make this available to our Node applications
module.exports = mongoose.model('User', User);