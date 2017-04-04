// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// create a schema

var histSchema = new Schema({
    entrada: [String],
    vendas: [String]
},{
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Historico = mongoose.model('Historico', histSchema);

// make this available to our Node applications
module.exports = Historico;