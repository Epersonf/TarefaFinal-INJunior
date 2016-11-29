// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


var supervisorSchema = new Schema({
	pessoaId: {
		type: ObjectId,		
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
		default: 30
	}
	pecas: [String],
	totalPecas: {
		type: Number,
		required: true,
		default: 0
	},
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Supervisor = mongoose.model('Supervisor', supervisorSchema);

// make this available to our Node applications
module.exports = Supervisor;