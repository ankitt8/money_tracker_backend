/* eslint-disable */
const express = require('express');
// const cors = require('cors');
const dotenv = require('dotenv');
// getting User Modal
// const User = require('./models/DailyTransaction');
const connectDB = require('./config/db');
// load config
dotenv.config({ path: './config/config.env' });

const bodyParser = require('body-parser');
const DailyTransaction = require('./models/DailyTransaction');
// use bodyParser to parse req.body
const jsonParser = bodyParser.json();

// app.use(cors({
//     'allowedHeaders': ['sessionId', 'Content-Type'],
//     'exposedHeaders': ['sessionId'],
//     'origin': ['http://localhost:3000/', 'https://adoring-benz-a639db.netlify.app/'],
//     'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     'preflightContinue': false
// }));
const app = express();
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use('/api', jsonParser);

// POST method to register a new entry
app.post('/api/add_transaction', (req, res) => {
    const daiilyTransact = new DailyTransaction(req.body);
    console.log(req.body);
    daiilyTransact.save()
        .then((transactSavedDetails) => {
            res.status(200).json({ Status: `Transaction with id ${transactSavedDetails} added successfully!` });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send('Failed To Add transaction');
        });
});



// gET method to get user detials to shown on home page
app.get('/api/get_transactions', (req, res) => {
    DailyTransaction.find({}, (err, transactions) => {
        if (err) {
            res.status(400).send('Failed to get transactions');
        } else {
            res.status(200).json(transactions);
        }
    });
});

// GET method to get specific user details
// async function edit(filter, update) {
//   let updatedUser = await User.findByIdAndUpdate(filter, update, {
//     new: true
//   })
// }
app.post('/api/edit_transaction', (req, res) => {
    const updatedTransaction = req.body;
    const id = req.query.transactionId;
    DailyTransaction.findByIdAndUpdate(id, updatedTransaction, (err, result) => {
        if (err) {
            res.status(400).send(`Unable to edit transaction with ${id}`);
        } else {
            res.status(200).json(`Transaction with id=${id} upated succesfully, updated transaction is ${result}`);
        }
    })

});
// app.get('/api/get_user', (req, res) => {
//     const _id = req.query.userId;
//     console.log(_id)
//     User.findOne({ _id }, (err, result) => {
//         if (err) {
//             res.status(400).send('User not found!!');
//         } else {
//             res.status(200).json(result);
//         }
//     })
// })

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    connectDB();
});
