// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
	name: {
		type: String,		
        required: true
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Tag = mongoose.model('Tag', tagSchema);

// make this available to our Node applications
module.exports = Tag;