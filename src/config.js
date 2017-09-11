// load .env environment variables
require('dotenv').config({ path: '.env.dev' });

const host = process.env.HOST;
const port = process.env.PORT;

const fullHost = `http://${host}:${port}`;

const dbUser = process.env.DBUSER;
const dbPass = process.env.DBPASS;

// set default db link name as localhost
const dbHost = process.env.DBHOST;

// set default db name based on .env file, overwrite if testing
let dbName = process.env.DBNAME;
// if testing use the test db instead
if (process.env.NODE_ENV === 'test') {
  dbName = `${dbName}_test`;
}

// set string up with user and password later (might need port after host)
const dbConnectStr = `postgres://${dbUser}:${dbPass}@${dbHost}/${dbName}`;

const dbConfig = {
  dialect: 'postgres',
  pool: {
    max: 1,
    min: 0,
    validate() {
      return dbConnectStr === this.currentConnectionUrl;
    },
  },
  query: {
    raw: true,
  },
};

if (process.env.NODE_ENV === 'production') {
  dbConfig.logging = false;
}

const jwtSecret = process.env.JWT_SECRET;

module.exports = {
  host,
  port,
  fullHost,
  dbConnectStr,
  dbConfig,
  jwtSecret,
};
