import sequelize from '@db/index';
import SiteModel from '@models/Site.model';
import FileModel from '@models/File.model';
import TranslationModel from '@models/Translation.model';
import PipelineModel from '@models/Pipeline.model';
import { Sequelize } from 'sequelize-typescript';

const getRepositories = (sequelize: Sequelize) => {
  return {
    siteRepository: sequelize.getRepository(SiteModel),
    translationRepository: sequelize.getRepository(TranslationModel),
    pipelineRepository: sequelize.getRepository(PipelineModel),
    fileRepository: sequelize.getRepository(FileModel),
  };
};

export default getRepositories(sequelize);
