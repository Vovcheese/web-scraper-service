import { Context } from 'koa';
import { fileServiceFactory } from '@services/index';
import fs from 'fs';

export default async (ctx: Context) => {
  const fileId = Number(ctx.params.fileId);

  const result = await fileServiceFactory().getFilePath(fileId)

  const src = fs.createReadStream(result.path);

  ctx.body = src;
};
