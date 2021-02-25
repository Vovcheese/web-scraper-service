import { Context } from 'koa';
import fileService from '@services/domain/File/index';
import fs from 'fs';
import path from 'path';

export default async (ctx: Context) => {
  const fileId = Number(ctx.params.fileId);

  const findFile = await fileService.findOne(
    {
      where: { id: fileId },
    }
  );

  if(!findFile) throw new Error('File nit found')

  const src = fs.createReadStream(path.join(process.cwd(), 'views', String(findFile.siteId), findFile.fileName));
  ctx.response.set("content-type", "text/html");
  ctx.body = src;
};
