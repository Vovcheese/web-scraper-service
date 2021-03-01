import { Context } from 'koa';
import fileService from '@services/domain/File/index';
import fs from 'fs';

export default async (ctx: Context) => {
  const fileId = Number(ctx.params.fileId);

  const result = await fileService.getFilePath(fileId)

  const src = fs.createReadStream(result.path);

  ctx.body = src;
};
