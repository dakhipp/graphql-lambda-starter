const { GraphQLString, GraphQLNonNull } = require('graphql');

const AuthType = require('../types/auth');
const { login, register } = require('../resolvers/auth');

const authResolver = {
  login: {
    type: AuthType,
    description: 'This will login a user and give them a token to authenticate with.',
    args: {
      username: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'Username of the user',
      },
      password: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'Password of the user',
      },
    },
    resolve(parentValue, args) {
      return login(args);
    }
  },
  register: {
    type: AuthType,
    description: 'This will register a user and give them a token to authenticate with.',
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'Name of the user',
      },
      username: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'Username of the user',
      },
      phone_number: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'Phone number of the user',
      },
      email: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'Email of the user',
      },
      password: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'Password of the user',
      },
      password_conf: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'Password confirmation of the user',
      },
    },
    resolve(parentValue, args) {
      return register(args);
    },
  }
};

module.exports = authResolver;
