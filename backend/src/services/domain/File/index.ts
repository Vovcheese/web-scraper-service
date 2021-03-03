import { Repository } from 'sequelize-typescript';
import BaseCRUD from '@services/domain/BaseCRUD';
import FileModel from '@db/models/File.model';
import { repos, op} from '@db/index';
import { cheerioService, ICheerioService } from '@/services/cheerio/index';
import path from 'path';
import mfs, { promises as fs } from 'fs';

export interface IFolderStructure {
  folders: { child: IFolderStructure, folder: FileModel }[],
  files: FileModel[]
}

export interface IFileService extends BaseCRUD<FileModel> {
  replaceFileHeaders(siteId: number, fileId: number, html:string): Promise<void>
  generateFileStructure(siteId: number, parent: number, structure: IFolderStructure): Promise<void>
  getFilePath(fileId: number): Promise<{
    siteId: number;
    path: string; 
    file: FileModel;
  }>;
  deleteFile(fileId: number): Promise<void>;
  deleteRecursiveFolderDb(folderId: number): Promise<void>;
  uploadFiles(parent: number, siteId: number, files: any): Promise<void>;
}

export class FileService extends BaseCRUD<FileModel> implements IFileService{
  constructor(
    private fileRepository: Repository<FileModel>,
    private cheerioService: ICheerioService,

  ) {
    super(fileRepository);
  }

  async replaceFileHeaders(siteId: number, fileId: number, html:string) {


    const findFilesSite = await this.findAll({ where: { siteId, ext: '.html', id: { [op.ne]: fileId } } })

    const mainHead = this.cheerioService.findHead(html);

    for (const file of findFilesSite) {
      const pathFile = path.join(process.cwd(), 'views', String(siteId), file.fileName);
      const readFile = await fs.readFile(pathFile);
      const resultHtml = this.cheerioService.replaceHeader(readFile.toString(), mainHead)
      await fs.writeFile(pathFile, resultHtml);
    }
  }

  async getFilePath(fileId: number) {
    const findFile = await this.findOne(
      {
        where: { id: fileId },
      }
    );
  
    if (!findFile) throw new Error('File not found')
    
    let pathFile = path.join(process.cwd(), 'views', String(findFile.siteId))
  
    if (findFile.parent !== 0) {
      const pathArray: string[] = [findFile.fileName];
      let parent = findFile.parent;
  
      while (parent !== 0) {
        const findFolder = await this.findOne({ where: { id: parent }})
        parent = findFolder.parent
        pathArray.push(findFolder.fileName)
      }
  
      pathFile = path.join(pathFile, pathArray.reverse().join('/'));
    } else {
      pathFile = path.join(pathFile, findFile.fileName);
    }

    return { siteId: findFile.siteId, path: pathFile, file:findFile }
  }

  async generateFileStructure(siteId: number, parent: number, structure: IFolderStructure) {
    const list = await this.findAll(
      {
        where: { siteId, parent },
      },
    );
    
  
    for (const file of list) {
      if(!file.isFolder) {
        structure.files.push(file);
      }
      if (file.isFolder) {
        const index = structure.folders.push({ child: { folders:[], files: [] }, folder: file })
        await this.generateFileStructure(siteId, file.id, structure.folders[index - 1].child)
      }
  
    }
  }

  async deleteFile(fileId: number) {
    const result = await this.getFilePath(fileId);
    if(result.file.isFolder) {
      await fs.rmdir(result.path, { recursive: true });
      await this.deleteRecursiveFolderDb(result.file.id);
    } else {
      await fs.unlink(result.path);
    }
    await result.file.destroy();
  }

  async deleteRecursiveFolderDb(folderId: number) {
    const findFolders = await this.findAll({ where: { parent: folderId, isFolder: true } })
    for (const folder of findFolders) {
      await this.deleteRecursiveFolderDb(folder.id);
    }
    await this.delete({ where: { parent: folderId, isFolder: false } })
    await this.delete({ where: { id: folderId } })
  }

  async uploadFiles(parent: number, siteId: number, files: any) {
    let writePath = path.join(process.cwd(),'views', String(siteId));

    if(parent !== 0) {
      const result = await this.getFilePath(parent);
      writePath = result.path;
    }
    
    if(!Array.isArray(files)) {
      files = [files];
    }

    for (const file of files) {
      await this.create({
        siteId,
        parent,
        fileName: file.name,
        size: file.size,
        ext: path.extname(file.name),
      })
      const ws = mfs.createWriteStream(path.join(writePath, file.name));
      const rs = mfs.createReadStream(file.path);
  
      await rs.pipe(ws);
    }
  }
}



export default new FileService(
  repos.fileRepositiory,
  cheerioService
);
