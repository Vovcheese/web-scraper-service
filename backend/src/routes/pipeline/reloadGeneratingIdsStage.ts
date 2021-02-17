import { Context } from 'koa';
import siteService from '@services/domain/Site/index';
import translationService from '@services/domain/Translation/index';
import pipelineService from '@services/domain/Pipline/index';
import { EStatus, ETypePipeline } from '@db/interfaces';

interface IBody {
  langList: string[];
}

export default async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId);
  const body: IBody = ctx.request.body;

  const findSite = await siteService.findOne({ where: { id: siteId } });

  if (!findSite) {
    throw new Error('Site not found');
  }

  const findPipeline = await pipelineService.findOne({
    where: {
      siteId,
      type: ETypePipeline.GENERATEID,
    },
  });

  if (findPipeline.status !== EStatus.ERROR) {
    throw new Error('The pipeline cannot be started');
  }

  await pipelineService.reloadStatus(findPipeline);

  await translationService.delete({ where: { siteId } });

  await siteService.processGenerateTextIdsStage(findSite.id, body.langList);

  ctx.body = { success: true };
};
