const graphql = require('graphql');

const { GraphQLObjectType } = graphql;

const user = require('./user');
const book = require('./book');

const RootQuery = new GraphQLObjectType({
  name: 'Queries',
  description: 'These are the queries provided by our application',
  fields: Object.assign({}, user, book),
});

module.exports = RootQuery;
