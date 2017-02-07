// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var supervisorSchema = new Schema({
    nome:{
		type: String,
		required: true
	},
	investidor: {
        type: Boolean,
        required: true,
		default: false
    },
	porcentagem: {
		type: Number,
		required: true,
		default: 10
	},
	totalPecas: {
		type: Number,
		required: true,
		default: 0
	},
	proxAcerto:{
		type: Date,
		required: true,
		default: new Date(+new Date() + 45*24*60*60*1000)
	},
	pecas: [String]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Supervisor = mongoose.model('Supervisor', supervisorSchema);

// make this available to our Node applications
module.exports = Supervisor;