const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
}  = require('graphql');
const fetch = require('node-fetch');
const { url } = require('./constant');
const TransactionType = new GraphQLObjectType({
    name: 'Transaction',
    description: '...',

    fields: () => ({
        _id: {
            type: GraphQLString,
            resolve: (transaction) => transaction['_id']
        },
        heading: {
            type: GraphQLString,
            resolve: (transaction) => transaction['heading']
        },
        amount: {
            type: GraphQLInt,
            resolve: (transaction) => transaction['amount']
        },
        date: {
            type: GraphQLString,
            resolve: (transaction) => transaction['date']
        },
        mode: {
            type: GraphQLString,
            resolve: (transaction) => transaction['mode']
        },
        type: {
            type: GraphQLString,
            resolve: (transaction) => transaction['type']
        },
        category: {
            type: GraphQLString,
            resolve: (transaction) => transaction['category']
        }
    })
})
const QueryType = new GraphQLObjectType({
    name: 'Transactions',
    description: 'Gets the transactions for a particular userId passed',

    fields : () => ({
        transactions: {
            type: new GraphQLList(TransactionType),
            args: {
                userId: { type: GraphQLString }
            },
            resolve: (root, args) => {
                return fetch(url.API_URL_GET_TRANSACTIONS+`/${args.userId}`)
                // .then(res => res.json())
                // .then((val) => val)
            }
        }
    })
})

module.exports = new GraphQLSchema({
    query: QueryType
})