import { Context } from 'koa';
import siteService from '@services/domain/Site/index';
import translationService from '@services/domain/Translation/index';
import pipelineService from '@services/domain/Pipline/index';
import { EStatus, ETypePipeline } from '@db/interfaces';
import { translaterService } from '@services/translater/index';

interface IBody {
  langList: string[];
}

export default async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId);

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

  await siteService.processTranslationStage(findSite.id);

  ctx.body = { success: true };
};
