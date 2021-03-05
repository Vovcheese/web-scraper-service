import { Context } from 'koa';
import { siteServiceFactory, pipelineServiceFactory, translationServiceFactory } from '@services/index';
import { EStatus, ETypePipeline } from '@db/interfaces';

interface IBody {
  langList: string[];
}

export default async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId);
  const body: IBody = ctx.request.body;

  const findSite = await siteServiceFactory().findOne({ where: { id: siteId } });

  if (!findSite) {
    throw new Error('Site not found');
  }

  const findPipeline = await pipelineServiceFactory().findOne({
    where: {
      siteId,
      type: ETypePipeline.GENERATEID,
    },
  });

  if (findPipeline.status !== EStatus.ERROR) {
    throw new Error('The pipeline cannot be started');
  }

  await pipelineServiceFactory().reloadStatus(findPipeline);

  await translationServiceFactory().delete({ where: { siteId, default: false } });

  await pipelineServiceFactory().processGenerateTextIdsStage(findSite.id, body.langList, findSite.url);

  ctx.body = { success: true };
};
