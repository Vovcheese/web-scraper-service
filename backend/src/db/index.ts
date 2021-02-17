import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import config from '@config/index';

const sequelize = new Sequelize(config.bd.mysql);

export const op = Op;

sequelize.authenticate().then(async () => {
  console.log('success connect to db');
  await sequelize.sync({ alter: true });
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});

export default sequelize;
