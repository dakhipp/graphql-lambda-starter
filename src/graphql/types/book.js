const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');

const { getById } = require('../resolvers/user');

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'Book Type, For all books in the database.',

  fields: () => ({
    id: {
      type: GraphQLInt,
      description: 'ID of the book',
    },
    title: {
      type: GraphQLString,
      description: 'Title of the book',
    },
    content: {
      type: GraphQLString,
      description: 'Content of the book',
    },
    UserId: {
      type: GraphQLInt,
      description: 'ID of the owner of the book',
    },
    owner: {
      // eslint-disable-next-line
      type: require('./user'),
      description: 'The owner of the book',
      resolve(parentValue) {
        return getById(parentValue.UserId);
      }
    }
  })
});

module.exports = BookType;
