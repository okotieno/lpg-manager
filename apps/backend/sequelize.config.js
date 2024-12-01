const { ConfigService } = require('@nestjs/config');
const { config } = require('dotenv');

config(); // Load .env file
const configService = new ConfigService();

const dbConfig = {
  development: {
    dialect: configService.get('LPG_DATABASE_DIALECT'),
    host: configService.get('LPG_DATABASE_HOST'),
    username: configService.get('LPG_DATABASE_USERNAME'),
    password: configService.get('LPG_DATABASE_PASSWORD'),
    database: configService.get('LPG_DATABASE_DATABASE'),
    port: configService.get('LPG_DATABASE_PORT'),
    paranoid: true
  },

  production: {
    // Production database configuration
  },
};

module.exports = dbConfig;
