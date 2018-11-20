// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var notificationSchema = new Schema({
    from: {
		type: ObjectId,		
        required: false,
        ref: 'User'
    },
    to: {
		type: ObjectId,		
        required: true,
        ref: 'User'
    },
	type: {
		type: String,
		required: true,
		default: "Simple"
    },
    status: {
        type: String,
        required: true,
        default: "Pending"
    },
    pieces: [String],
    content: {
        type: [String],
        required: true
    },
    extras: String
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Notification = mongoose.model('Notification', notificationSchema);

// make this available to our Node applications
module.exports = Notification;