/* eslint-disable */
const express = require('express');
const mongoose = require('mongoose')
// const cors = require('cors');
const dotenv = require('dotenv');
// getting User Modal
// const User = require('./models/DailyTransaction');
const connectDB = require('./config/db');
// load config
dotenv.config({ path: './config/config.env' });

// const bodyParser = require('body-parser');
const Transaction = require('./models/Transaction');
const User = require('./models/User');
// use bodyParser to parse req.body
// const jsonParser = bodyParser.json();

// app.use(cors({
//     'allowedHeaders': ['sessionId', 'Content-Type'],
//     'exposedHeaders': ['sessionId'],
//     'origin': ['http://localhost:3000/', 'https://adoring-benz-a639db.netlify.app/'],
//     'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     'preflightContinue': false
// }));
const app = express();
app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:3000', 'https://moneytrackerankit.netlify.app']

    if (allowedOrigins.includes(req.headers.origin)) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', ',content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(express.json());

const checkUserExists = (username) => {
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            return { userExists: false, error: 'Something broke from our end ):' };
        } else {
            if (user) return { userExists: true };
            else return { userExists: false, error: 'Invalid username' }
        }
    });

}
// POST method to check the credentials for signin
app.post('/api/signin', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            res.status(400).json({ error: 'Something broke from our end ):' })
        } else if (user) {
            if (user.password === password) {
                const userId = user._id;
                const username = user.username;
                res.status(200).json({ success: 'Userlogged in successfully!', userId, username });
            } else {
                res.status(400).json({ error: 'Invalid Username or password' });
            }
        } else {
            res.status(400).json({ error: 'User not found ):' });
        }
    });
})

// Signup route
app.post('/api/signup', (req, res) => {
    const { username } = req.body;
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            res.status(400).json({ error: 'Something went wrong' });
        } else if (user) {
            res.status(400).json({ error: 'User Already Exists!' });
        } else {
            const user = new User(req.body);
            user.save()
                .then((userSavedDetails) => {
                    const { username } = userSavedDetails;
                    res.status(200).json({ ...userSavedDetails, error: '', userId: userSavedDetails._id, username });
                })
                .catch((err) => {
                    // console.log(err);
                    res.status(400).json({ error: 'Something went wrong' });
                })
        }
    })

});

app.post('/api/add_transaction', (req, res) => {
    const Transact = new Transaction(req.body);
    Transact.save()
        .then((transactSavedDetails) => {
            return res.status(200).json(transactSavedDetails);
        })
        .catch((err) => {
            return res.status(400).send('Failed To Add transaction');
        });
});

app.post('/api/get-transaction-categories', (req, res) => {
    User.findById(
        req.body.userId,
        function callback(err, doc) {
            if (err) {
                res.status(404).json({ error: err });
            } else {
                res.status(201).json({
                    transactionCategories: {
                        credit: doc.creditTransactionCategories,
                        debit: doc.debitTransactionCategories
                    }
                })
            }
        }
    )
})

app.post('/api/add-credit-transaction-category', (req, res) => {
    const { userId, category } = req.body;
    User.findByIdAndUpdate(
        userId,
        { $push: { creditTransactionCategories: category } },
        { new: true },
        function callback(err, doc) {
            if (err) {
                res.status(404).json({ error: err });
            } else {
                res.status(200).json({ successMsg: `Transaction Category ${category} added successfully` });
            }
        }
    )
});

app.post('/api/add-debit-transaction-category', (req, res) => {
    const { userId, category } = req.body;
    User.findByIdAndUpdate(
        userId,
        { $push: { debitTransactionCategories: category } },
        { new: true },
        function callback(err, doc) {
            if (err) {
                res.status(404).json({ error: err });
            } else {
                res.status(200).json({ successMsg: `Transaction Category ${category} added successfully` });;
            }
        }
    )
});

app.post('/api/delete-credit-transaction-category', (req, res) => {
    // const { userId, category } = req.body;
    const { userId, categories } = req.body;
    User.findByIdAndUpdate(
        userId,
        // Not able to figure out below why the category didn't get deleted
        // maybe can use sub documetns later to make it more scalable
        // { $pull: { creditTransactionCategories: { $eleMatch: category } } },
        { $set: { creditTransactionCategories: categories } },
        { new: true },
        function callback(err, doc) {
            if (err) {
                res.status(404).json({ error: err });
            } else {
                res.status(200).json({ msg: `Transaction Category ${categories} deleted successfully!` });
            }
        }
    )
});

app.post('/api/delete-debit-transaction-category', (req, res) => {
    // const { userId, category } = req.body;
    const { userId, categories } = req.body;
    User.findByIdAndUpdate(
        userId,
        // Not able to figure out below why the category didn't get deleted
        // maybe can use sub documetns later to make it more scalable
        // { $pull: { debitTransactionCategories: { $eleMatch: category } } },
        { $set: { debitTransactionCategories: categories } },
        { new: true },
        function callback(err, doc) {
            if (err) {
                console.error(err);
                res.status(404).json({ error: err });
            } else {
                res.status(200).json({ msg: `Transaction Category ${categories} deleted successfully!` });
            }
        }
    )
});

// gET method to get user detials to shown on home page
app.post('/api/get_transactions', (req, res) => {
    const { userId } = req.body;
    if (userId == '' || userId == undefined) {
        return res.status(400).json({ error: 'Invalid userId' });
    }
    Transaction
        .find({ userId: userId })
        .exec(function (err, transactions) {
            if (err) {
                return res.status(400).json({ error: 'Failed to get transactions' });
            };
            const currentMonthTransactions = getCurrentMonthTransactions(transactions);
            return res.status(200).json(currentMonthTransactions);
        });
    function getCurrentMonthTransactions(transactions) {
        const currMonth = new Date().getMonth();
        return (transactions.filter(transaction => transaction.date.getMonth() === currMonth));
    }

});

app.post('/api/edit_transaction', (req, res) => {
    const updatedTransaction = req.body;
    const id = req.query.id;
    Transaction.findByIdAndUpdate(id, updatedTransaction, { returnOriginal: false }, (err, result) => {
        if (err) {
            res.status(400).send(`Unable to edit transaction with ${id}`);
        } else {
            res.status(200).json(result);
        }
    })
});

app.post('/api/delete_transaction', (req, res) => {
    const id = req.query.id;
    Transaction.deleteOne({ _id: id }, function (err, result) {
        if (err) {
            res.status(400).send(`Unable to delete transaction with id ${id}`);
        } else {
            res.status(200).json({ transactionId: id });
        }
    })
})
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    connectDB();
});
