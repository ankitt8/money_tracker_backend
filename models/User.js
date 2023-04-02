const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  transactions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}],
  creditTransactionCategories: [String],
  debitTransactionCategories: [String],
  borrowedTransactionCategories: [String],
  balance: [{type: mongoose.Schema.Types.ObjectId, ref: 'Balance'}],
  bankAccounts: [String],
  creditCards: [String],
});

module.exports = mongoose.model('User', UserSchema);
