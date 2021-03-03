import { promises as fs } from 'fs';
import path from 'path';
import { repos } from '@db/index';
import SiteModel from '@db/models/Site.model';
import { Repository } from 'sequelize-typescript';
import BaseCRUD from '@services/domain/BaseCRUD';

export interface ISiteService extends BaseCRUD<SiteModel>{
  removeSiteFolder(siteId: number): any;
}

export class SiteService extends BaseCRUD<SiteModel> implements ISiteService{
  constructor(
    private siteRepositiory: Repository<SiteModel>,
  ) {
    super(siteRepositiory);
  }
  

  async removeSiteFolder(siteId: number) {
    const pathFolder = path.join(process.cwd(), 'views', String(siteId));
    try {
      await fs.stat(pathFolder);
      await fs.rmdir(pathFolder, { recursive: true });
    } catch (e) {
      console.log(e)
    }
  }
}

export default new SiteService(
  repos.siteRepositiory
);
