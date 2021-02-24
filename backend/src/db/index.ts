import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import config from '@config/index';
import run from '@db/run';
// import models from '@models/index';
import UserModel from '@models/User.model';
import FileModel from '@models/File.model';
import MigrationModel from '@models/Migration.model';
import PipelineModel from '@models/Pipeline.model';
import SiteModel from '@models/Site.model';
import TranslationModel from '@models/Translation.model';


const sequelize = new Sequelize(config.bd.mysql);

export const op = Op;

const force = process.env.FORCE_DB === 'true'

sequelize.authenticate().then(async () => {
  console.log('success connect to db force', force);
  await sequelize.sync()
  await run('seeders')
  await run('migrations')
  
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});

export const repos = {
  userRepositiory: sequelize.getRepository(UserModel),
  fileRepositiory: sequelize.getRepository(FileModel),
  migrationRepositiory: sequelize.getRepository(MigrationModel),
  pipelineRepositiory: sequelize.getRepository(PipelineModel),
  siteRepositiory: sequelize.getRepository(SiteModel),
  translationRepositiory: sequelize.getRepository(TranslationModel)
}

export default sequelize;
