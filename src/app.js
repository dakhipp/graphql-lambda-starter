const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const expressGraphQL = require('express-graphql');
const timeout = require('connect-timeout');
const queryComplexity = require('graphql-query-complexity').default;

const { User } = require('./db/models');
const GraphQLSchema = require('./graphql/schema');
const config = require('./config');

const app = express();

// set maximum request size
app.use(bodyParser.json({ limit: '1mb' }));
// set timeout of 3 seconds
app.use(timeout(3000));
function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}
// stupid favicon fix, otherwise chrome makes request on every keyup inside graphiql
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'favicon.ico'));
});
// decode token on every request
app.use('/', jwt({
  secret: config.jwtSecret,
  requestProperty: 'auth',
  credentialsRequired: false,
}));
// fetch user from token id and attach to the request
app.use('/', (req, res, done) => {
  if (req.auth) {
    return User
      .findOne({ where: { id: req.auth.id } })
      .then((user) => {
        req.context = {
          user,
        };
        return done();
      })
      .catch((err) => {
        console.log(err);
        return done();
      });
  }
  return done();
});
// register graphiql and graphql schema
app.use(
  '/',
  expressGraphQL((req, res, { variables }) => ({
    graphiql: true,
    schema: GraphQLSchema,
    context: req.context,
    validationRules: [queryComplexity({
      maximumComplexity: 1000,
      variables,
      onComplete: (complexity) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Query Complexity:', complexity);
        }
      }
    })]
  }))
);
// use timeout
app.use(haltOnTimedout);

module.exports = app;
