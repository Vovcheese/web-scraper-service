import { Context } from 'koa';
import { fileServiceFactory } from '@services/index';
import { IFolderStructure } from '@services/domain/File/index';

export default async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId);
  const resultStructure: IFolderStructure = { folders: [], files: [] }

  await fileServiceFactory().generateFileStructure(siteId, 0, resultStructure)

  ctx.body = { ...resultStructure };
};