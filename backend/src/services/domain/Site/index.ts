import SiteModel from '@models/Site.model';
import { Model, Repository } from 'sequelize-typescript';
import repos from '@models/index';
import BaseCRUD from '../BaseCRUD';

export class SiteService extends BaseCRUD<SiteModel>{
  constructor(private siteRepositiory: Repository<SiteModel>, model: new () => SiteModel) {
    super(siteRepositiory, model);
  }
}

export default new SiteService(repos.siteRepository, SiteModel);
