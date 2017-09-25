const request = require('supertest');

const app = require('../../src/app');
const { destoryUsers, buildRegisterQuery, buildLoginQuery } = require('../utils');

if (process.env.NODE_ENV !== 'testing') {
  console.log('Invalid environment.');
  process.exit(0);
}

// clear out user db
afterAll((done) => {
  destoryUsers()
    .then(() => { done(); })
    .catch((err) => {
      console.log(err);
    });
});

describe('Integration: Auth Mutations', () => {
  test('Register should succeed with a user that does not exist.', (done) => {
    const query = buildRegisterQuery({
      name: 'name',
      username: 'username',
      phoneNumber: 'phone',
      email: 'email',
      password: 'Password123!',
      passwordConf: 'Password123!',
    });
    return request(app)
      .post('/')
      .set('Accept', 'application/json')
      .send({ query })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.register.id).toBe('1');
        done();
      });
  });

  test('Register should fail if the user already exists.', (done) => {
    const query = buildRegisterQuery({
      name: 'name',
      username: 'username',
      phoneNumber: 'phone',
      email: 'email',
      password: 'Password123!',
      passwordConf: 'Password123!',
    });
    return request(app)
      .post('/')
      .set('Accept', 'application/json')
      .send({ query })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.errors[0].message).toBe('User already exists.');
        done();
      });
  });

  test('Register should fail is password and password confirmation do not match.', (done) => {
    const query = buildRegisterQuery({
      name: 'name123',
      username: 'username123',
      phoneNumber: 'phone123',
      email: 'email123',
      password: 'Password123!!!',
      passwordConf: 'Password123!',
    });
    return request(app)
      .post('/')
      .set('Accept', 'application/json')
      .send({ query })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.errors[0].message).toBe('Password does not match password confirmation.');
        done();
      });
  });

  test('Register should fail if password does not meet complexity requirements.', (done) => {
    const query = buildRegisterQuery({
      name: 'name123',
      username: 'username123',
      phoneNumber: 'phone123',
      email: 'email123',
      password: 'Password',
      passwordConf: 'Password',
    });
    return request(app)
      .post('/')
      .set('Accept', 'application/json')
      .send({ query })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.errors[0].message).toBe('Password does not match minimum complexity requirements.');
        done();
      });
  });

  test('Log in should succeed with existing user.', (done) => {
    const query = buildLoginQuery({
      username: 'username',
      password: 'Password123!',
    });
    return request(app)
      .post('/')
      .set('Accept', 'application/json')
      .send({ query })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.login.id).toBe('1');
        done();
      });
  });

  test('Log in should fail with a non-existing user.', (done) => {
    const query = buildLoginQuery({
      username: '123',
      password: 'Password',
    });
    return request(app)
      .post('/')
      .set('Accept', 'application/json')
      .send({ query })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.errors[0].message).toBe('Invalid credentials.');
        done();
      });
  });
});
