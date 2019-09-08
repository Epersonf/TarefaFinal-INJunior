var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const logSchema = new Schema({
  type: {
    type: String,
    enum: ['Error']
  },
  user: String,
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