import sequelize from '@db/index';
import SiteModel from '@db/models/Site.model';
import TranslationModel from '@models/Translation.model';
import PipelineModel from '@models/Pipeline.model';
import UserModel from '@models/User.model';
import MigrationModel from '@models/Migration.model';
import { Sequelize } from 'sequelize-typescript';
import FileModel from '@db/models/File.model';


const getRepositories = (sequelize: Sequelize) => {
  return {
    siteRepository: sequelize.getRepository(SiteModel),
    translationRepository: sequelize.getRepository(TranslationModel),
    pipelineRepository: sequelize.getRepository(PipelineModel),
    fileRepository: sequelize.getRepository(FileModel),
    userRepository: sequelize.getRepository(UserModel),
    migrationRepository: sequelize.getRepository(MigrationModel),
  };
};

export default getRepositories(sequelize);
