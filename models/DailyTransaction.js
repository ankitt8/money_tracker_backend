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
    },
    mode: {
        type: String
    }
})

module.exports = mongoose.model('DailyTransaction', DailyTransactionSchema);