// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

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
	nascimento: {
        type: Date,
        //required: true
    },
	cpf: {
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
	},
    //caracteristicas extras, depende do tipo de usuario
    estoquista: {
        type: ObjectId,
        //required: true
    },
    supervisor: {
        type: ObjectId,
        //required: true
    },
    porcentagem: {
		type: Number
		//required: true,
	},
    investidor: {
        type: Boolean
        //required: true,
    },
    proxAcerto:{
		type: Date
		//required: true,
	},
    estoque: [String],
    vendido: [String],
    totalVendido: Number,
    tipoTaxa: String,//vista, primeiro, parcelado
    taxa: Number

}, {
    timestamps: true
});

User.plugin(passportLocalMongoose);

// make this available to our Node applications
module.exports = mongoose.model('User', User);