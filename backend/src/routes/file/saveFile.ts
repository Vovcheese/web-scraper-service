import { Context } from 'koa';
import fileService from '@services/domain/File/index';
import { promises as fs } from 'fs';
import { op } from '@db/index';
import path from 'path';
import { cheerioService } from '@services/cheerio/index';

interface ISaveFileBody {
  code: string;
}

export default async (ctx: Context) => {
  const fileId = Number(ctx.params.fileId);
  const body: ISaveFileBody = ctx.request.body;
  const replaceHeaders = ctx.query.replaceHeader

  const findFile = await fileService.findOne(
    {
      where: { id: fileId },
    }
  );

  if (!findFile) throw new Error('File not found')

  await fs.writeFile(path.join(process.cwd(), 'views', String(findFile.siteId), findFile.fileName), body.code);

  if (replaceHeaders) {
    await fileService.replaceFileHeaders(findFile.siteId, fileId, body.code)
  }

  ctx.body = { success: true };
};
