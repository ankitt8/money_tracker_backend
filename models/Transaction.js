const mongoose = require('mongoose')
// const User = require('./User');
const TransactionSchema = new mongoose.Schema({
    heading: {
        type: String
    },
    amount: {
        type: Number
    },
    date: {
        type: Date
    },
    mode: {
        type: String
    },
    bankAccount: {
        type: String
    },
    creditCard: {
        type: String
    },
    type: {
        type: String
    },
    category: {
        type: String
    },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Transaction', TransactionSchema);
// export default mongoose.model('DailyTransaction',DailyTransactionSchema);
