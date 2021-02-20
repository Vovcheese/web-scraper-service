import { Repository } from 'sequelize-typescript';
import repos from '@models/index';
import BaseCRUD from '@services/domain/BaseCRUD';
import FileModel from '@db/models/File.model';

export interface IFileService extends BaseCRUD<FileModel> {}

export class FileService extends BaseCRUD<FileModel> implements IFileService{
  constructor(
    private translationRepositiory: Repository<FileModel>,
  ) {
    super(translationRepositiory);
  }
}

export default new FileService(
  repos.fileRepository,
);
