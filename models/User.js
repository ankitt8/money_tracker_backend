const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  creditTransactionCategories: [String],
  debitTransactionCategories: [String],
  lentTransactionCategories: [String],
});

module.exports = mongoose.model('User', UserSchema);
