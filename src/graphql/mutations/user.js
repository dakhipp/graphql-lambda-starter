const { GraphQLString, GraphQLID, GraphQLNonNull } = require('graphql');

const { requiredProvided, isOwner, scopeIsValid } = require('../utils/validation');

const UserType = require('../types/user');
const { updateUser, deleteUser } = require('../resolvers/user');

const userMutations = {
  updateUser: {
    type: UserType,
    description: 'This will update a user by ID, only the same user can update their information.',
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'ID of the user to be updated',
      },
      name: {
        type: GraphQLString,
        description: 'Name of the user',
      },
      phone_number: {
        type: GraphQLString,
        description: 'Phone number of the user',
      },
      email: {
        type: GraphQLString,
        description: 'Email of the user',
      },
    },
    resolve(parentValue, args, { user }) {
      if (requiredProvided(args, user) && isOwner(args.id, user.id)) {
        return updateUser(args.id, args);
      }
      return new Error('Insufficient scope');
    }
  },
  deleteUser: {
    type: UserType,
    description: 'This will delete a user by ID, only an admin or the same user can delete a user.',
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'ID of the user to be deleted',
      },
    },
    resolve(parentValue, { id }, { user }) {
      const SCOPE = 'ADMIN';
      if (requiredProvided(id, user) && (scopeIsValid(SCOPE, user.scope) || isOwner(id, user.id))) {
        return deleteUser(id);
      }
      return new Error('Insufficient scope');
    }
  }
};

module.exports = userMutations;
