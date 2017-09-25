const request = require('supertest');

const app = require('../src/app');
const { User } = require('../src/db/models');

function buildRegisterQuery(user) {
  const {
    name,
    username,
    phoneNumber,
    email,
    password,
    passwordConf,
  } = user;
  return `mutation Register {
    register(name: "${name}", username: "${username}", phone_number: "${phoneNumber}", email: "${email}", password: "${password}", password_conf: "${passwordConf}") {
      id
      token
    }
  }`;
}

function buildLoginQuery(user) {
  const { username, password } = user;
  return `mutation Login {
    login(username: "${username}", password: "${password}") {
      id
      token
    }
  }`;
}

function userQuery(user) {
  const query = buildRegisterQuery(user);

  return new Promise((resolve, reject) => {
    return request(app)
      .post('/')
      .set('Accept', 'application/json')
      .send({ query })
      .then((res) => {
        return resolve(res);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

function getToken(id) {
  const query = buildLoginQuery({ username: `username-${id}`, password: `Password123!-${id}` });

  return request(app)
    .post('/')
    .set('Accept', 'application/json')
    .send({ query })
    .then((res) => {
      return res.body.data.login.token;
    })
    .catch((err) => {
      return err;
    });
}

function seedUsers(numberOfUsers) {
  const promiseQueue = [];

  for (let i = 1; i <= numberOfUsers; i += 1) {
    const user = {
      name: `name-${i}`,
      username: `username-${i}`,
      phoneNumber: `phone-${i}`,
      email: `email-${i}`,
      password: `Password123!-${i}`,
      passwordConf: `Password123!-${i}`,
    };

    promiseQueue.push(userQuery(user));
  }

  return Promise.all(promiseQueue);
}

function destoryUsers() {
  return User
    .destroy({
      where: {},
      cascade: true,
      truncate: true,
      restartIdentity: true,
    });
}

function getUserToken(id) {
  return new Promise((resolve, reject) => {
    return User.update(
      { scope: 'USER' },
      { where: { id } }
    )
      .then(() => {
        return resolve(getToken(id));
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

function getAdminToken(id) {
  return new Promise((resolve, reject) => {
    return User.update(
      { scope: 'ADMIN' },
      { where: { id } }
    )
      .then(() => {
        return resolve(getToken(id));
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

module.exports = {
  seedUsers,
  destoryUsers,
  buildRegisterQuery,
  buildLoginQuery,
  getUserToken,
  getAdminToken,
};
