const mongoose = require('mongoose')
// const User = require('./User');
const BalanceSchema = new mongoose.Schema({
    date: {
        type: Date
    },
    balances: [{
        name: String,
        amount: Number
    }],
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('AccountBalance', BalanceSchema);
// export default mongoose.model('DailyTransaction',DailyTransactionSchema);
