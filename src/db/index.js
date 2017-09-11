const Sequelize = require('sequelize');

const config = require('../config');

// Create shared instance to be used across models and in testing
const db = new Sequelize(config.dbConnectStr, config.dbConfig);

module.exports = db;
