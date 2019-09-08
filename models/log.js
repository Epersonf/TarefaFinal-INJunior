const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const logSchema = new Schema({
  type: {
    type: String,
    enum: ['Error']
  },
  user: {
    type: ObjectId,
    ref: 'User'
  },
  method: String,
  path: String,
  body: String,
  status: String,
  message: String,
  stack: String
}, {
  timestamps: true
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;