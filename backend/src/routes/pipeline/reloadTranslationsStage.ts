import { Context } from 'koa';
import { siteServiceFactory, pipelineServiceFactory } from '@services/index';
import { ETypePipeline } from '@db/interfaces';

interface IBody {
  langList: string[];
}

export default async (ctx: Context) => {
  const body = ctx.request.body
  const siteId = Number(ctx.params.siteId);
  const limit = Number(body.limit) || 0;

  const findSite = await siteServiceFactory().findOne({ where: { id: siteId } });

  if (!findSite) {
    throw new Error('Site not found');
  }

  const findPipeline = await pipelineServiceFactory().findOne({
    where: {
      siteId,
      type: ETypePipeline.TRANSLATING,
    },
  });

  await pipelineServiceFactory().reloadStatus(findPipeline);

  await pipelineServiceFactory().processTranslationStage(findSite.id, limit);

  ctx.body = { success: true };
};
