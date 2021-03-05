import { Context } from 'koa';
import { 
  fileServiceFactory, 
  translationServiceFactory,
  siteServiceFactory,
  pipelineServiceFactory 
} from '@services/index';

export default async (ctx: Context) => {
  const files = ctx.request.files;
  const parent = Number(ctx.params.fileId);
  const siteId = Number(ctx.request.body.siteId);

  await fileServiceFactory().uploadFiles(parent, siteId, files.file);

  const langList = await translationServiceFactory().getLangList(siteId);

  const findSite = await siteServiceFactory().findOne({where: { id: siteId }})

  await pipelineServiceFactory().processGenerateTextIdsStage(siteId, langList, findSite.url);

  ctx.body = { success: true };
};
