import { Context } from 'koa';
import fileService from '@services/domain/File/index';
import FileModel from '@/db/models/File.model';

interface IFolderStructure {
  folders: { child: IFolderStructure, folder: FileModel }[],
  files: FileModel[]
}

export default async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId);
  const resultStructure: IFolderStructure = { folders: [], files: [] }

  

  await generateFileStructure(siteId, 0, resultStructure)



  ctx.body = { ...resultStructure };
};


const generateFileStructure = async (siteId: number, parent: number, structure: IFolderStructure) => {
  const list = await fileService.findAll(
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
      await generateFileStructure(siteId, file.id, structure.folders[index - 1].child)
    }

  }
}
