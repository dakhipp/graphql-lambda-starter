const {
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt
} = require('graphql');

const { requiredProvided, isOwner, scopeIsValid } = require('../utils/validation');

const BookType = require('../types/book');
const {
  createBook,
  getById,
  updateBook,
  deleteBook,
} = require('../resolvers/book');

const bookMutations = {
  createBook: {
    type: BookType,
    description: 'This will create a new book.',
    args: {
      UserId: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'ID of the owner of the book',
      },
      title: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'Title of a book',
      },
      content: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'Content of a book',
      },
    },
    resolve(parentValue, args, { user }) {
      const SCOPE = 'USER';
      if (requiredProvided(args, user) && scopeIsValid(SCOPE, user.scope)) {
        return createBook(args);
      }
      return new Error('Insufficient scope');
    }
  },
  updateBook: {
    type: BookType,
    description: 'This will update a book by ID, only the owner can update a book.',
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'ID of the book to be updated',
      },
      title: {
        type: GraphQLString,
        description: 'Title of a book',
      },
      content: {
        type: GraphQLString,
        description: 'Content of a book',
      },
      UserId: {
        type: GraphQLInt,
        description: 'ID of the owner of the book',
      },
    },
    resolve(parentValue, args, { user }) {
      const SCOPE = 'USER';
      if (requiredProvided(args, user) && scopeIsValid(SCOPE, user.scope)) {
        // use the book id to fetch the book so it can be tested for ownership
        return getById(args.id)
          .then((book) => {
            // no book is found
            if (!book) {
              return new Error('Invalid book ID');
            }
            // if the user owns the book, update it
            if (isOwner(book.UserId, user.id)) {
              return updateBook(args.id, args)
                .then(newBook => newBook)
                .catch(err => err);
            }
            // the user doesn't own the book, cannot update it
            return new Error('Insufficient scope');
          })
          .catch(err => err);
      }
      return new Error('Insufficient scope');
    }
  },
  deleteBook: {
    type: BookType,
    description: 'This will delete a book by ID, only an admin or the owner of the book can delete a book.',
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'ID of the book to be deleted',
      },
    },
    resolve(parentValue, { id }, { user }) {
      const SCOPE = 'ADMIN';
      if (requiredProvided(id, user) && scopeIsValid('USER', user.scope)) {
        // use the book id to fetch the book so it can be tested for ownership
        return getById(id)
          .then((book) => {
            // no book is found
            if (!book) {
              return new Error('Invalid book ID');
            }
            // if the user owns the book or is an admin, delete the book
            if (scopeIsValid(SCOPE, user.scope) || isOwner(book.UserId, user.id)) {
              return deleteBook(id)
                .then(suc => suc)
                .catch(err => err);
            }
            // the user doesn't own the book and is not an admin, cannot delete it
            return new Error('Insufficient scope');
          })
          .catch(err => err);
      }
      return new Error('Insufficient scope');
    }
  }
};

module.exports = bookMutations;
