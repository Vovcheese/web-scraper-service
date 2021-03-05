import { Context } from 'koa';
import { fileServiceFactory } from '@services/index';

export default async (ctx: Context) => {
  const fileId = Number(ctx.params.fileId);

  await fileServiceFactory().deleteFile(fileId);

  ctx.body = { success: true };
};
