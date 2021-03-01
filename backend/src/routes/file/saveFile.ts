import { Context } from 'koa';
import fileService from '@services/domain/File/index';
import { promises as fs } from 'fs';
import path from 'path';

interface ISaveFileBody {
  code: string;
}

export default async (ctx: Context) => {
  const fileId = Number(ctx.params.fileId);
  const body: ISaveFileBody = ctx.request.body;
  const replaceHeaders = ctx.query.replaceHeader

  const result = await fileService.getFilePath(fileId)

  await fs.writeFile(result.path, body.code);

  if (replaceHeaders) {
    await fileService.replaceFileHeaders(result.siteId, fileId, body.code)
  }

  ctx.body = { success: true };
};
