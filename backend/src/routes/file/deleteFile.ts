import { Context } from 'koa';
import fileService from '@services/domain/File/index';

export default async (ctx: Context) => {
  const fileId = Number(ctx.params.fileId);

  await fileService.deleteFile(fileId);

  ctx.body = { success: true };
};
