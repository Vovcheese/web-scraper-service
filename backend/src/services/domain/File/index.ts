import { Repository } from 'sequelize-typescript';
import BaseCRUD from '@services/domain/BaseCRUD';
import FileModel from '@db/models/File.model';
import { repos, op} from '@db/index';
import { cheerioService, ICheerioService } from '@/services/cheerio/index';
import path from 'path';
import { promises as fs } from 'fs';

export interface IFileService extends BaseCRUD<FileModel> {}

export class FileService extends BaseCRUD<FileModel> implements IFileService{
  constructor(
    private translationRepositiory: Repository<FileModel>,
    private cheerioService: ICheerioService
  ) {
    super(translationRepositiory);
  }

  async replaceFileHeaders(siteId: number, fileId: number, html:string) {


    const findFilesSite = await this.findAll({ where: { siteId, ext: '.html', id: { [op.ne]: fileId } } })

    const mainHead = this.cheerioService.findHead(html)

    for (const file of findFilesSite) {
      const pathFile = path.join(process.cwd(), 'views', String(siteId), file.fileName);
      const readFile = await fs.readFile(pathFile);
      const resultHtml = this.cheerioService.replaceHeader(readFile.toString(), mainHead)
      await fs.writeFile(pathFile, resultHtml);
    }
  }

}

export default new FileService(
  repos.fileRepositiory,
  cheerioService
);
