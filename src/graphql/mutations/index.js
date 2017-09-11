const graphql = require('graphql');

const { GraphQLObjectType } = graphql;

const auth = require('./auth');
const user = require('./user');
const book = require('./book');

const mutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'These are the mutations provided by our application',
  fields: Object.assign({}, auth, user, book),
});

module.exports = mutation;
