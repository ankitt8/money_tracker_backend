/* eslint-disable */
const express = require("express");
// const { graphqlHTTP } = require('express-graphql');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { URL } = require("./constant");
// const schema = require('./schema.js');
// load config
dotenv.config(getDotEnvConfigOptions());

const Transaction = require("./models/Transaction");
const User = require("./models/User");
const Balance = require("./models/Balance");

const app = express();
// app.use(graphqlHTTP({
//   schema,
//   graphiql: true
// }));

app.use(function (req, res, next) {
  // const allowedOrigins = [
  //   "http://localhost:3000",
  //   "http://localhost:3001",
  //   "https://moneytrackerankit.netlify.app",
  //   "https://issue-37-ui-improvement--moneytrackerankit.netlify.app",
  // ];
  // const requestOrigin = req.headers.origin;
  res.setHeader("Access-Control-Allow-Origin", "*");
  // if (allowedOrigins.includes(requestOrigin)) {
  //   res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  // }
  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // for how long to cache the preflight request response
  res.setHeader("Access-Control-Max-Age", 8640);
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
      return { userExists: false, error: "Something broke from our end ):" };
    } else {
      if (user) return { userExists: true };
      else return { userExists: false, error: "Invalid username" };
    }
  });
};
// POST method to check the credentials for signin
app.post(URL.API_URL_SIGNIN, (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      res.status(400).json({ error: "Something broke from our end ):" });
    } else if (user) {
      if (user.password === password) {
        const userId = user._id;
        const username = user.username;
        res
            .status(200)
            .json({ success: "Userlogged in successfully!", userId, username });
      } else {
        res.status(400).json({ error: "Invalid Username or password" });
      }
    } else {
      res.status(400).json({ error: "User not found ):" });
    }
  });
});

app.post(URL.API_URL_SIGNUP, (req, res) => {
  const { username } = req.body;
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      res.status(400).json({ error: "Something went wrong" });
    } else if (user) {
      res.status(400).json({ error: "User Already Exists!" });
    } else {
      const user = new User(req.body);
      user
          .save()
          .then((userSavedDetails) => {
            const { username } = userSavedDetails;
            res.status(200).json({
              ...userSavedDetails,
              error: "",
              userId: userSavedDetails._id,
              username,
            });
          })
          .catch((err) => {
            res.status(400).json({ error: "Something went wrong" });
          });
    }
  });
});

app.post(URL.API_URL_ADD_TRANSACTION, (req, res) => {
  const Transact = new Transaction(req.body);
  Transact.save()
      .then((transactSavedDetails) => {
        return res.status(200).json(transactSavedDetails);
      })
      .catch((err) => {
        return res.status(400).send("Failed To Add transaction");
      });
});

app.post(URL.API_URL_GET_TRANSACTION_CATEGORIES, (req, res) => {
  User.findById(req.body.userId, function callback(err, doc) {
    if (err) {
      res.status(404).json({ error: err });
    } else {
      res.status(201).json({
        transactionCategories: {
          credit: doc?.creditTransactionCategories ?? [],
          debit: doc?.debitTransactionCategories ?? [],
          borrowed: doc?.borrowedTransactionCategories ?? [],
        },
      });
    }
  });
});


app.post(URL.API_URL_GET_PAYMENT_INSTRUMENTS, (req, res) => {
  const {userId, flag} = req.body;
  User.findById(userId, function callback(err, doc) {
    if (err) {
      res.status(404).json({error: err});
    } else {
      res.status(201).json(flag === 'bankAccounts' ? doc.bankAccounts : doc.creditCards);
    }
  });
});

app.post(URL.API_URL_ADD_TRANSACTION_CATEGORY, (req, res) => {
  const {userId, category, type} = req.body;
  let obj = {};
  if(type === 'debit') {
    obj = { debitTransactionCategories: category }
  } else if(type === 'credit') {
    obj = { creditTransactionCategories: category }
  } else {
    obj = { borrowedTransactionCategories: category }
  }
  User.findByIdAndUpdate(
      userId,
      { $push: obj },
      { new: true },
      function callback(err, doc) {
        if (err) {
          res.status(404).json({ error: err });
        } else {
          res.status(200).json({
            successMsg: `Transaction Category ${category} of type ${type} added successfully`,
          });
        }
      }
  );
});

app.post(URL.API_URL_ADD_PAYMENT_INSTRUMENT, (req, res) => {
  const {flag, userId, paymentInstrumentName} = req.body;
  let obj = {
    bankAccounts: paymentInstrumentName
  }
  if (flag === 'creditCards') {
    obj = {
      creditCards: paymentInstrumentName
    }
  }
  User.findByIdAndUpdate(
      userId,
      {$push: obj},
      {new: true},
      function callback(err, doc) {
        if (err) {
          res.status(404).json({error: err});
        } else {
          res.status(200).json({
            paymentInstrumentAdded: paymentInstrumentName
          });
        }
      }
  );
})

app.post(URL.API_URL_DELETE_TRANSACTION_CATEGORY, (req, res) => {
  // const { userId, category } = req.body;
  // TODO why in payload whole categories is being sent it will increase payload
  // send only category fromclient and backend should delete that
  const { userId, categories, type } = req.body;
  let obj = {};
  if(type === 'debit') {
    obj = { debitTransactionCategories: categories }
  } else if(type === 'credit') {
    obj = { creditTransactionCategories: categories }
  } else {
    obj = { borrowedTransactionCategories: categories }
  }
  User.findByIdAndUpdate(
      userId,
      // Not able to figure out below why the category didn't get deleted
      // maybe can use sub documetns later to make it more scalable
      // { $pull: { debitTransactionCategories: { $eleMatch: category } } },
      { $set: obj },
      { new: true },
      function callback(err, doc) {
        if (err) {
          console.error(err);
          res.status(404).json({ error: err });
        } else {
          res.status(200).json({
            msg: `Transaction Category deleted successfully!`,
          });
        }
      }
  );
});

app.post(URL.API_URL_DELETE_PAYMENT_INSTRUMENT, (req, res) => {
  const {userId, flag, newPaymentInstruments} = req.body;
  let obj = {bankAccounts: newPaymentInstruments};
  if (flag === 'creditCards') {
    obj = {creditCards: newPaymentInstruments}
  }
  User.findByIdAndUpdate(
      userId,
      // Not able to figure out below why the category didn't get deleted
      // maybe can use sub documetns later to make it more scalable
      // { $pull: { debitTransactionCategories: { $eleMatch: category } } },
      {$set: obj},
      {new: true},
      function callback(err, doc) {
        if (err) {
          console.error(err);
          res.status(404).json({error: err});
        } else {
          res.status(200).json({paymentInstruments: newPaymentInstruments});
        }
      }
  );
});

app.post(URL.API_URL_GET_TRANSACTIONS, (req, res) => {
  const {
    userId,
    startDate: requestStartDateString,
    endDate: requestEndDateString,
    transactionType,
    category
  } = req.body;

  if (userId == "" || userId == undefined) {
    return res.status(400).json({error: "Invalid userId"});
  }
  const currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();

  let filterStartDate = new Date(currentYear, currentMonth, 1);
  let filterEndDate = new Date(currentYear, currentMonth + 1, 0);
  if (requestStartDateString) filterStartDate = new Date(requestStartDateString);
  if (requestEndDateString) filterEndDate = new Date(requestEndDateString);

  let filterObj = {userId: userId, "date": {$gte: filterStartDate.toISOString(), $lte: filterEndDate.toISOString()}};
  if (transactionType) {
    filterObj.type = transactionType;
  }
  if (category) {
    filterObj.category = category;
  }

  Transaction.find(filterObj).sort('-date').exec(function (err, transactions) {
    if (err) {
      return res.status(400).json({error: "Failed to get transactions"});
    }
    return res.status(200).json(transactions);
  });
});

app.post(URL.API_URL_EDIT_TRANSACTION, (req, res) => {
  const updatedTransaction = req.body;
  const id = req.query.id;
  Transaction.findByIdAndUpdate(
      id,
      updatedTransaction,
      { returnOriginal: false },
      (err, result) => {
        if (err) {
          res.status(400).send(`Unable to edit transaction with ${id}`);
        } else {
          res.status(200).json(result);
        }
      }
  );
});

app.post(URL.API_URL_DELETE_TRANSACTION, (req, res) => {
  const id = req.query.id;
  Transaction.deleteOne({ _id: id }, function (err, result) {
    if (err) {
      res.status(400).send(`Unable to delete transaction with id ${id}`);
    } else {
      res.status(200).json({ transactionId: id });
    }
  });
});

app.post(URL.API_URL_ADD_BALANCE, (req, res) => {
  const body = req.body;
  console.log(body);
  const NewBalance = new Balance(req.body);
  NewBalance.save()
      .then((balanceSavedDetails) => {
        return res.status(200).json(balanceSavedDetails);
      })
      .catch((err) => {
        return res.status(400).send("Failed To Balance Info");
      });
})

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDB();
});

function getDotEnvConfigOptions() {
  const isEnvProduction = false;
  let dotEnvConfigOptions = {};
  if (isEnvProduction) {
    dotEnvConfigOptions = {
      path: "./config/config-prod.env",
    };
  } else {
    dotEnvConfigOptions = {
      path: "./config/config-local.env",
    };
  }
  return dotEnvConfigOptions;
}
