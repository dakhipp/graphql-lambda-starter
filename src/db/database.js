const config = require('../config');

const sequelizeConfig = { url: config.dbConnectStr, dialect: 'postgres' };
sequelizeConfig.production = sequelizeConfig;
sequelizeConfig.test = sequelizeConfig;
sequelizeConfig.development = sequelizeConfig;

// Export final database config
module.exports = sequelizeConfig;
