const { User } = require('../../db/models');

/**
 * Query, returns array of all user objects with pagenation
 * @param {Number} perPage
 * @param {Number} page
 * @return {Array} getAll
 */
function getAll(perPage, page) {
  return new Promise((resolve, reject) => User
    .findAll({
      attributes: {
        exclude: [
          'password',
          'scope',
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
 * Query, returns a user from the database based on id
 * @param {Number} id
 * @return {Object} getById
 */
function getById(id) {
  return new Promise((resolve, reject) => User
    .find({
      where: {
        id
      },
      attributes: {
        exclude: [
          'password',
          'scope',
          'createdAt',
          'updatedAt',
        ],
      }
    })
    .then(results => resolve(results))
    .catch(err => reject(err)));
}

/**
 * Mutation, updates a user based on id
 * @param {Number} id
 * @param {Object} updatedUser
 * @return {Object} updateUser
 */
function updateUser(id, updatedUser) {
  const newUpdatedUser = updatedUser;
  delete newUpdatedUser.id;
  return new Promise((resolve, reject) => User
    .update(newUpdatedUser, {
      where: {
        id,
      },
      plain: true,
      returning: true,
    })
    .then(returnedUser => resolve(returnedUser[1]))
    .catch(err => reject(err)));
}

/**
 * Mutation, deletes user by id
 * @param {Number} id
 * @return {Object} deleteUser (null)
 */
function deleteUser(id) {
  return new Promise((resolve, reject) => User
    .destroy({
      where: {
        id,
      },
      attributes: {
        exclude: [
          'password',
          'scope',
          'createdAt',
          'updatedAt',
        ],
      },
    })
    .then(returnedUser => resolve(returnedUser))
    .catch(err => reject(err)));
}

module.exports = {
  getAll,
  getById,
  updateUser,
  deleteUser,
};
