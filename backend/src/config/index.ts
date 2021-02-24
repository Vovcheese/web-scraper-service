import { resolve, join } from 'path';
import { SequelizeOptions } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

const host = 'http://localhost';
const port = 4050
const modelsPath = process.env.NODE_ENV === 'development' ?
 resolve(`${process.cwd()}/src/db/models/**/*.model.ts`) :
 resolve(`${process.cwd()}/dist/db/models/**/*.model.js`);

const config = {
  app: {
    auth: {
      accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
      accessTokenLife: process.env.ACCESS_TOKEN_LIFE,
      refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
      refreshTokenLife: process.env.REFRESH_TOKEN_LIFE,
    },
  },
  server: {
    host,
    port,
  },
  bd: {
    mysql: {
      repositoryMode: true,
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 4306,
      database: process.env.MYSQL_DB || 'scraper',
      dialect: 'mariadb',
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'my-secret-pw',
      storage: ':memory:',
      models: [modelsPath],
      logging: false,
    } as SequelizeOptions,
  },
};

export default config;
