const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const resolvers = require('../controllers/graphqlController');

const schema = buildSchema(`
    type User {
        id: ID!
        name: String!
    }

    type Query {
        users: [User]
    }

    type Mutation {
        createUser(name: String!): User
    }
`);

const graphqlMiddleware = graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
});

module.exports = graphqlMiddleware;
