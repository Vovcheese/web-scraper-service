import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import config from '@config/index';


const sequelize = new Sequelize(config.bd.mysql);

export const op = Op;

const force = process.env.FORCE_DB === 'true'

sequelize.authenticate().then(async () => {
  console.log('success connect to db force', force);
  if (force) {
    await sequelize.sync({ force: true })
  }
  
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});

export default sequelize;
