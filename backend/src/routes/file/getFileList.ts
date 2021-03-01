import { Context } from 'koa';
import fileService, { IFolderStructure } from '@services/domain/File/index';

export default async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId);
  const resultStructure: IFolderStructure = { folders: [], files: [] }

  await fileService.generateFileStructure(siteId, 0, resultStructure)

  ctx.body = { ...resultStructure };
};