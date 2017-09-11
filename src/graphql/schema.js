const { GraphQLSchema } = require('graphql');

// import all mutations
const mutation = require('./mutations');

// import all queries
const query = require('./queries');

// export the schema
module.exports = new GraphQLSchema({ query, mutation });
