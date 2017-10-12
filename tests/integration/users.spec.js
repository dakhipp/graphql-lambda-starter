const request = require('supertest');

const app = require('../../src/app');
const {
  seedUsers,
  destoryUsers,
  getUserToken
} = require('../utils');

if (process.env.NODE_ENV !== 'testing') {
  console.log('Invalid environment.');
  process.exit(0);
}

let userToken = ''; // id: 1, scope: USER
// let adminToken = ''; // id: 2, scope: ADMIN

// seed db with 15 users, tokens above
beforeAll((done) => {
  seedUsers(15)
    .then(() => getUserToken(1))
    .then((ut) => { userToken = ut; })
    // .then(() => getAdminToken(2))
    // .then((at) => { adminToken = at; })
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

describe('Integration: Users Queries', () => {
  const query = `query Users {
    users(page: 0, perPage: 10) {
      id
      name
    }
  }`;

  test('Get users should succeed with USER scoped token and return 10 users per page.', (done) => {
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

  test('Get users should succeed with USER scoped token and return page 2 with the last 5 users.', (done) => {
    const query2 = `query Users {
      users(page: 1, perPage: 10) {
        id
        name
      }
    }`;
    return request(app)
      .post('/')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ query: query2 })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.users.length).toBe(5);
        done();
      });
  });

  test('Get users should fail if no token is provided, with error: "Insufficient scope."', (done) => {
    return request(app)
      .post('/')
      .set('Accept', 'application/json')
      .send({ query })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.errors[0].message).toBe('Insufficient scope.');
        done();
      });
  });
});

describe('Integration: User Queries', () => {
  const query = `query User {
    user(id: "1") {
      id
      name
    }
  }`;

  test('Get user should succeed with USER scoped token and return a user.', (done) => {
    return request(app)
      .post('/')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ query })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.user).toBeTruthy();
        expect(response.body.data.user.name).toBe('name-1');
        done();
      });
  });

  test('Get user should return null if a valid token is provided but the ID provided does not exist.', (done) => {
    const invalidQuery = `query User {
      user(id: "55") {
        id
        name
      }
    }`;
    return request(app)
      .post('/')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ query: invalidQuery })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.user).toBe(null);
        done();
      });
  });

  test('Get user should fail if no token is provided, with error: "Insufficient scope."', (done) => {
    return request(app)
      .post('/')
      .set('Accept', 'application/json')
      .send({ query })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.errors[0].message).toBe('Insufficient scope.');
        done();
      });
  });
});
