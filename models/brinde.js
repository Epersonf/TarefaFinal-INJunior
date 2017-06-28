// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var brindeSchema = new Schema({
	peca: {
		type: String
	},
	consultorId: {
		type: ObjectId,		
        required: true
	},
    consultorNome: {
        type: String,		
        required: true
    },
    status: {
        type: String,//pendente ou entregue	
        default: "Pendente",
        required: true
    },
    campanha: { 
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Brinde = mongoose.model('Brinde', brindeSchema);

// make this available to our Node applications
module.exports = Brinde;