import { Context } from 'koa';
import fileService from '@services/domain/File/index';
import {promises as fs} from 'fs';
import path from 'path';

export default async (ctx: Context) => {
  const fileId = Number(ctx.params.fileId);
  const body = ctx.request.body;

  const findFile = await fileService.findOne(
    {
      where: { id: fileId },
    }
  );

  if (!findFile) throw new Error('File nit found')
  
  await fs.writeFile(path.join(process.cwd(), 'views', String(findFile.siteId), findFile.fileName), body);

  ctx.body = { success: true };
};
