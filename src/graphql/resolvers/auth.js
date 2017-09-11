const JWT = require('jsonwebtoken');
const Bcrypt = require('bcrypt');

const { User } = require('../../db/models');

const config = require('../../config');

/**
 * Internal, removes properties we don't want to send to the client
 * @param {Object} user
 * @return {Object} removeUnwanted (user object - password & date stamps)
 */
function removeUnwanted(user) {
  const newUser = user;
  delete newUser.password;
  delete newUser.createdAt;
  delete newUser.updatedAt;
  return newUser;
}

/**
 * Internal, attaches the default scope of USER to a user
 * @param {Object} user
 * @return {Object} attachScope (user object + USER scope)
 */
function attachScope(user) {
  const newUser = user;
  newUser.scope = 'USER';
  return newUser;
}

/**
 * Internal, attaches a token to a user object
 * @param {Object} user
 * @return {Object} attachToken (user object + token)
 */
function attachToken(user) {
  const newUser = user;
  newUser.token = JWT.sign(newUser, config.jwtSecret);
  return newUser;
}

/**
 * Internal, creates a user in the database
 * @param {Object} user
 * @return {Object} createUser (user object)
 */
function createUser(user) {
  return new Promise((resolve, reject) => User
    .create(user)
    .then(createdUser => resolve(createdUser))
    .catch(err => reject(err)));
}

/**
 * Internal, returns a hashed password
 * @param {String} password
 * @return {String} hashPassword
 */
function hashPassword(password) {
  return new Promise((resolve, reject) => {
    Bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return reject(err);
      }

      return resolve(hash);
    });
  });
}

/**
 * Internal, comapres a plain password to a hashed password
 * @param {String} plainPass
 * @param {Object} hashedPassUser
 * @return {Object} comparePassword (user object + hashed password)
 */
function comparePassword(plainPass, hashedPassUser) {
  return new Promise((resolve, reject) => {
    Bcrypt.compare(plainPass, hashedPassUser.password, (err, res) => {
      if (err) {
        return reject(err);
      }
      if (!res) {
        return reject(new Error('Invalid credentials.'));
      }
      return resolve(hashedPassUser);
    });
  });
}

/**
 * Internal, searches the database for a user by username
 * @param {String} username
 * @return {Object} getUserByUsername (user object)
 */
function getUserByUsername(username) {
  return new Promise((resolve, reject) => User
    .findOne({
      where: {
        username,
      },
    })
    .then(result => resolve(result))
    .catch(err => reject(err)));
}

/**
 * Mutation, logs in an existing user
 * @param {String} username
 * @param {String} password
 * @return {Object} login (user object + token)
 */
function login({ username, password }) {
  return new Promise((resolve, reject) => getUserByUsername(username)
    .then((user) => {
      if (!user) {
        reject(new Error('Invalid credentials.'));
      }
      return comparePassword(password, user);
    })
    .then(validatedUser => resolve(attachToken(removeUnwanted(validatedUser))))
    .catch(err => reject(err)));
}

/**
 * Mutation, creates a new user
 * @param {Object} userArgs
 * @return {Object} register (user object + token)
 */
function register(userArgs) {
  return new Promise((resolve, reject) => getUserByUsername(userArgs.username)
    .then((user) => {
      // https://dzone.com/articles/use-regex-test-password
      if (userArgs.password !== userArgs.password_conf) {
        throw new Error('Password does not match password confirmation.');
      }
      // eslint-disable-next-line
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(userArgs.password)) {
        throw new Error('Password does not match minimum complexity requirements.');
      }
      if (user) {
        throw new Error('User already exists.');
      }
      return hashPassword(userArgs.password);
    })
    .then((password) => {
      const hashedUser = userArgs;
      hashedUser.password = password;
      return createUser(attachScope(hashedUser));
    })
    .then((createdUser) => {
      resolve(attachToken(removeUnwanted(createdUser.dataValues)));
    })
    .catch((err) => {
      reject(err);
    }));
}

module.exports = {
  login,
  register,
};
