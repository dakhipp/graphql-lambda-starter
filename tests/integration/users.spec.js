const request = require('supertest');

const app = require('../../src/app');
const {
  seedUsers,
  destoryUsers,
  getUserToken,
  getAdminToken
} = require('../utils');

if (process.env.NODE_ENV !== 'testing') {
  console.log('Invalid environment.');
  process.exit(0);
}

let userToken = ''; // id: 1, scope: USER
let adminToken = ''; // id: 2, scope: ADMIN

// seed db with 15 users, tokens above
beforeAll((done) => {
  seedUsers(15)
    .then(() => getUserToken(1))
    .then((ut) => { userToken = ut; })
    .then(() => getAdminToken(2))
    .then((at) => { adminToken = at; })
    .then(() => { done(); })
    .catch((err) => {
      console.log(err);
    });
});

// clear out user db
afterAll((done) => {
  destoryUsers()
    .then(() => { done(); })
    .catch((err) => {
      console.log(err);
    });
});

describe('Integration: Users Query', () => {
  const query = `query Users {
    users(page: 0, perPage: 10) {
      id
      name
    }
  }`;

  test('Should fail insufficient scope with no token.', (done) => {
    return request(app)
      .post('/')
      .set('Accept', 'application/json')
      .send({ query })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.errors[0].message).toBe('Insufficient scope');
        done();
      });
  });

  test('Should pass with USER scoped token.', (done) => {
    return request(app)
      .post('/')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ query })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.users.length).toBe(10);
        done();
      });
  });

  test('Should pass with ADMIN scoped token.', (done) => {
    return request(app)
      .post('/')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ query })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.users.length).toBe(10);
        done();
      });
  });
});
