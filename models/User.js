const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
});

module.exports = mongoose.model('User', UserSchema);