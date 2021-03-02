import { Context } from 'koa';
import fileService from '@services/domain/File/index';

export default async (ctx: Context) => {
  const files = ctx.request.files;
  const parent = Number(ctx.params.fileId);
  const siteId = Number(ctx.request.body.siteId);

  await fileService.uploadFiles(parent, siteId, files.file);

  ctx.body = { success: true };
};
