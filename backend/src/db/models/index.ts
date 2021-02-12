import sequelize from '@db/index';
import SiteModel from '@models/Site.model';
import TranslationModel from '@models/Translation.model';
import { Sequelize } from 'sequelize-typescript';

const getRepositories = (sequelize: Sequelize) => {
  return {
    siteRepository: sequelize.getRepository(SiteModel),
    translationRepository: sequelize.getRepository(TranslationModel),
  };
};

export default getRepositories(sequelize);
