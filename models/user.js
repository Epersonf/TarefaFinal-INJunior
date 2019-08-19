// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// create a schema
var User = new Schema({
	username: {
		type: String,		
        unique: true
	},
	passowrd: {
		type: String,		
    },
    email:{
        type: String
    },
	status: { //ativo, inativo, pendente
        type: String,
		default: "Pendente"
    },
    nome: {
        type: String
    },
    sobrenome: {
        type: String
    },
	whatsapp: {
        type: String
    },
	nascimento: {
        type: Date
    },
	cpf: {
        type: String
    },
	cidade: {
        type: String
    },
	endereco: {
        type: String
    },
	cep: {
        type: String
    },
	tipo: { //supervisor, consultor, controladoria, estoque, 
        type: String
    },
	sexo: {
		type: String
	},
    //caracteristicas extras, depende do tipo de usuario
    estoquista: {
        type: ObjectId,
        ref: 'User'
        //required: true
    },
    supervisor: {
        type: ObjectId,
        ref: 'User'
        //required: true
    },
    indicador: {
        type: ObjectId,
        ref: 'User'
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
    taxa: Number,
    desconto:{
        type: Number,
        default: 0
    } ,
    state: String,
    notificacoes: {
        type: [ObjectId], 
        ref: 'Notification',
        default: []
    },
    receivedOrders: {
        type: [{
            type: ObjectId,
            ref: 'Encomenda'
        }],
    },

}, {
    timestamps: true
});

User.plugin(passportLocalMongoose);

// make this available to our Node applications
module.exports = mongoose.model('User', User);