const mongoose = require('mongoose')
const DailyTransactionSchema = new mongoose.Schema({
    heading: {
        type: String
    },
    amount: {
        type: Number
    },
    date: {
        type: Date
    }
})

module.exports = mongoose.model('DailyTransaction', DailyTransactionSchema);