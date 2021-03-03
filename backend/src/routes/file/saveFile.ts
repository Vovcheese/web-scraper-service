import { Context } from 'koa';
import fileService from '@services/domain/File/index';
import { promises as fs } from 'fs';
interface ISaveFileBody {
  code: string;
  replaceHeaders: boolean;
}

export default async (ctx: Context) => {
  const fileId = Number(ctx.params.fileId);
  const body: ISaveFileBody = ctx.request.body;
  const replaceHeaders = body.replaceHeaders;

  const result = await fileService.getFilePath(fileId)

  await fs.writeFile(result.path, body.code);

  if (replaceHeaders) {
    await fileService.replaceFileHeaders(result.siteId, fileId, body.code)
  }

  ctx.body = { success: true };
};
