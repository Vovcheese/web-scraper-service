import { resolve } from 'path';
import { SequelizeOptions } from 'sequelize-typescript';
import dotenv from 'dotenv';
dotenv.config();

const host = 'http://localhost';
const port = 4040;

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
      models: [resolve(`${process.cwd()}/src/db/models/**/*.model.ts`)],
      logging: process.env.NODE_ENV === 'development',
    } as SequelizeOptions,
  },
};

export default config;
