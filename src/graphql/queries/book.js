const {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt,
} = require('graphql');

const { requiredProvided, scopeIsValid } = require('../utils/validation');

const BookType = require('../types/book');
const { getAll, getById } = require('../resolvers/book');

const bookQueries = {
  books: {
    type: new GraphQLList(BookType),
    description: 'This will return all the books in our database.',
    args: {
      perPage: {
        type: new GraphQLNonNull(GraphQLInt),
        description: 'Number of users per page',
      },
      page: {
        type: new GraphQLNonNull(GraphQLInt),
        description: 'Current page of query results',
      },
    },
    resolve(parentValue, args, { user }) {
      const SCOPE = 'USER';
      if (requiredProvided(1, user) && scopeIsValid(SCOPE, user.scope)) {
        return getAll(args.perPage, args.page);
      }
      return new Error('Insufficient scope');
    },
  },
  book: {
    type: BookType,
    description: 'This will return one book by ID.',
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve(parentValue, { id }, { user }) {
      const SCOPE = 'USER';
      if (requiredProvided(id, user) && scopeIsValid(SCOPE, user.scope)) {
        return getById(id);
      }
      return new Error('Insufficient scope');
    },
  },
};

module.exports = bookQueries;
