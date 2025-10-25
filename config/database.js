require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'database.sqlite',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_STORAGE || 'database.sqlite',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  },
  test: {
    username: process.env.TEST_DB_USERNAME || '',
    password: process.env.TEST_DB_PASSWORD || '',
    database: process.env.TEST_DB_NAME || 'test_database.sqlite',
    host: process.env.TEST_DB_HOST || 'localhost',
    dialect: process.env.TEST_DB_DIALECT || 'sqlite',
    storage: process.env.TEST_DB_STORAGE || 'test_database.sqlite',
    logging: false,
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOST,
    dialect: process.env.PROD_DB_DIALECT || 'sqlite',
    storage: process.env.PROD_DB_STORAGE || 'production_database.sqlite',
    logging: false,
  },
};

// Set the environment based on NODE_ENV
const env = process.env.NODE_ENV || 'development';
const config = module.exports[env];

// For SQLite, we don't need username/password
if (config.dialect === 'sqlite') {
  delete config.username;
  delete config.password;
}
