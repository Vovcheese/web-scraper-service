import { Context } from 'koa';
import siteService from '@services/domain/Site/index';
import pipelineService from '@services/domain/Pipline/index';
import { ETypePipeline } from '@db/interfaces';

interface IBody {
  langList: string[];
}

export default async (ctx: Context) => {
  const body = ctx.request.body
  const siteId = Number(ctx.params.siteId);
  const limit = Number(body.limit) || 0;

  const findSite = await siteService.findOne({ where: { id: siteId } });

  if (!findSite) {
    throw new Error('Site not found');
  }

  const findPipeline = await pipelineService.findOne({
    where: {
      siteId,
      type: ETypePipeline.TRANSLATING,
    },
  });

  await pipelineService.reloadStatus(findPipeline);

  await pipelineService.processTranslationStage(findSite.id, limit);

  ctx.body = { success: true };
};
