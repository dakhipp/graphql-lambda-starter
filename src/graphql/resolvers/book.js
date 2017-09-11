const { Book } = require('../../db/models');

/**
 * Query, returns array of all book objects with pagenation
 * @param {Number} perPage
 * @param {Number} page
 * @return {Array} getAll
 */
function getAll(perPage, page) {
  return new Promise((resolve, reject) => Book
    .findAll({
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
        ],
      },
      limit: perPage,
      offset: perPage * page,
    })
    .then(results => resolve(results.map(result => result)))
    .catch(err => reject(err)));
}

/**
 * Query, returns a book from the database based on id
 * @param {Number} id
 * @return {Object} getById
 */
function getById(id) {
  return new Promise((resolve, reject) => Book
    .findById(id, {
      attributes: {
        include: [
          'UserId',
        ],
        exclude: [
          'createdAt',
          'updatedAt',
        ],
      },
    })
    .then(results => resolve(results))
    .catch(err => reject(err)));
}

/**
 * Query / UserType, returns array of all book objects beloging to a user with pagenation
 * @param {Number} UserId
 * @param {Number} perPage
 * @param {Number} page
 * @return {Array} getAllByUserId
 */
function getAllByUserId(UserId, perPage, page) {
  return new Promise((resolve, reject) => Book
    .findAll({
      where: {
        UserId,
      },
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
        ],
      },
      limit: perPage,
      offset: perPage * page,
    })
    .then(results => resolve(results.map(result => result)))
    .catch(err => reject(err)));
}

/**
 * Mutation, creates a new book
 * @param {Object} book
 * @return {Object} createBook
 */
function createBook(book) {
  return new Promise((resolve, reject) => Book
    .create(book)
    .then(createdBook => resolve(createdBook))
    .catch(err => reject(err)));
}

/**
 * Mutation, updates a book based on id
 * @param {Number} id
 * @param {Object} updatedBook
 * @return {Object} updateBook
 */
function updateBook(id, updatedBook) {
  const newUpdateBook = updatedBook;
  delete newUpdateBook.id;
  return new Promise((resolve, reject) => Book
    .update(newUpdateBook, {
      where: {
        id,
      },
      plain: true,
      returning: true,
    })
    .then(returnedBook => resolve(returnedBook[1]))
    .catch(err => reject(err)));
}

/**
 * Mutation, deletes book by id
 * @param {Number} id
 * @return {Object} deleteBook (null)
 */
function deleteBook(id) {
  return new Promise((resolve, reject) => Book
    .destroy({
      where: {
        id,
      },
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
        ],
      },
    })
    .then(rowsDeleted => resolve(rowsDeleted))
    .catch(err => reject(err)));
}

module.exports = {
  getAll,
  getAllByUserId,
  getById,
  createBook,
  updateBook,
  deleteBook,
};
