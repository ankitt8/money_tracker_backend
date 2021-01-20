const mongoose = require('mongoose')

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        })
        console.log(`MongoDB database connected at host ${conn.connection.host}`)
    } catch (error) {
        process.exit(1);
    }
}
module.exports = connectDB;