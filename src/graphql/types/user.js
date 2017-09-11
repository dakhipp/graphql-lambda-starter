const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} = require('graphql');

const BookType = require('./book');
const { getAllByUserId } = require('../resolvers/book');

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'User Type, For users in the database.',
  fields: () => ({
    id: {
      type: GraphQLInt,
      description: 'ID of the user',
    },
    name: {
      type: GraphQLString,
      description: 'Name of the user',
    },
    username: {
      type: GraphQLString,
      description: 'Username of the user',
    },
    phone_number: {
      type: GraphQLString,
      description: 'Phone number of the user',
    },
    email: {
      type: GraphQLString,
      description: 'Email of the user',
    },
    books: {
      // eslint-disable-next-line
      type: new GraphQLList(BookType),
      description: 'List of books owned by the user',
      args: {
        perPage: {
          type: new GraphQLNonNull(GraphQLInt),
          description: 'Number of books per page',
        },
        page: {
          type: new GraphQLNonNull(GraphQLInt),
          description: 'Current page of query results',
        },
      },
      resolve(parentValue, args) {
        console.log(args);
        return getAllByUserId(parentValue.id, args.perPage, args.page);
      },
    },
  })
});

module.exports = UserType;
