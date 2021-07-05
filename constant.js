const DEV_API_URL = 'http://localhost:8080/api/';
const PROD_API_URL = 'https://moneytrackerbackend.herokuapp.com/api/';
console.log(process.env.NODE_ENV);
const API_URL = process.env.NODE_ENV === `development` ? DEV_API_URL : PROD_API_URL;

const URL = {
    API_URL_GET_TRANSACTIONS: API_URL + 'get-transactions',
    API_URL_ADD_TRANSACTION: API_URL + 'add-transaction',
    API_URL_EDIT_TRANSACTION: API_URL + 'edit-transaction',
    API_URL_DELETE_TRANSACTION: API_URL + 'delete-transaction',
    API_URL_SIGNUP: API_URL + 'signup',
    API_URL_SIGNIN: API_URL + 'signin',
    API_URL_ADD_CREDIT_TRANSACTION_CATEGORY: API_URL + 'add-credit-transaction-category',
    API_URL_ADD_DEBIT_TRANSACTION_CATEGORY: API_URL + 'add-debit-transaction-category',
    API_URL_DELETE_CREDIT_TRANSACTION_CATEGORY: API_URL + 'delete-credit-transaction-category',
    API_URL_DELETE_DEBIT_TRANSACTION_CATEGORY: API_URL + 'delete-debit-transaction-category',
    API_URL_GET_TRANSACTION_CATEGORIES: API_URL + 'get-transaction-categories'
}

module.exports = {
    URL
}
