const {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt
} = require('graphql');

const { requiredProvided, scopeIsValid } = require('../utils/validation');

const UserType = require('../types/user');
const { getAll, getById } = require('../resolvers/user');

const userQueries = {
  users: {
    type: new GraphQLList(UserType),
    description: 'This will return all the users in our database.',
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
  user: {
    type: UserType,
    description: 'This will return one user by ID.',
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

module.exports = userQueries;
