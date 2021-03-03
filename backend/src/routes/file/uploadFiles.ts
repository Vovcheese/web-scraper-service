import { Context } from 'koa';
import fileService from '@services/domain/File/index';
import translationService from '@services/domain/Translation/index';
import siteService from '@services/domain/Site/index';
import pipelineService from '@services/domain/Pipeline/index';

export default async (ctx: Context) => {
  const files = ctx.request.files;
  const parent = Number(ctx.params.fileId);
  const siteId = Number(ctx.request.body.siteId);

  await fileService.uploadFiles(parent, siteId, files.file);

  const langList = await translationService.getLangList(siteId);

  const findSite = await siteService.findOne({where: { id: siteId }})

  await pipelineService.processGenerateTextIdsStage(siteId, langList, findSite.url);

  ctx.body = { success: true };
};
