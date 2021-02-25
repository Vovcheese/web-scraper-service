import { Context } from 'koa';
import fileService from '@services/domain/File/index';
import fs from 'fs';
import path from 'path';

export default async (ctx: Context) => {
  const fileId = Number(ctx.params.fileId);
  const body = ctx.request.body;
  const content = body.content;

  const findFile = await fileService.findOne(
    {
      where: { id: fileId },
    }
  );

  if (!findFile) throw new Error('File nit found')
  const readStream = fs.createReadStream(content);
  const writeStream = fs.createWriteStream(path.join(process.cwd(), 'views', String(findFile.siteId), findFile.fileName));

  readStream.pipe(writeStream)

  ctx.body = { success: true };
};
