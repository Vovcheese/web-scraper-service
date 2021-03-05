import { Context } from 'koa';
import { fileServiceFactory } from '@services/index';
import { promises as fs } from 'fs';
interface ISaveFileBody {
  code: string;
  replaceHeaders: boolean;
}

export default async (ctx: Context) => {
  const fileId = Number(ctx.params.fileId);
  const body: ISaveFileBody = ctx.request.body;
  const replaceHeaders = body.replaceHeaders;

  const result = await fileServiceFactory().getFilePath(fileId)

  await fs.writeFile(result.path, body.code);

  if (replaceHeaders) {
    await fileServiceFactory().replaceFileHeaders(result.siteId, fileId, body.code)
  }

  ctx.body = { success: true };
};
