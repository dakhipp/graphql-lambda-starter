const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');

const AuthType = new GraphQLObjectType({
  name: 'Auth',
  description: 'Auth Type, returned upon login or register.',

  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'ID of the user',
    },
    scope: {
      type: GraphQLString,
      description: 'Scope of the user',
    },
    token: {
      type: GraphQLString,
      description: 'Token belonging to the user',
    }
  })
});

module.exports = AuthType;
