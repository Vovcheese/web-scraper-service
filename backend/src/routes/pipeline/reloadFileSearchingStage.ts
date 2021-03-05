import { Context } from 'koa';
import { siteServiceFactory, pipelineServiceFactory, fileServiceFactory } from '@services/index';
import { EStatus, ETypePipeline } from '@db/interfaces';

export default async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId);

  const findSite = await siteServiceFactory().findOne({ where: { id: siteId } });

  if (!findSite) {
    throw new Error('Site not found');
  }

  const findPipeline = await pipelineServiceFactory().findOne({
    where: {
      siteId,
      type: ETypePipeline.FILESEARCHING,
    },
  });

  if (findPipeline.status !== EStatus.ERROR) {
    throw new Error('The pipeline cannot be started');
  }

  await pipelineServiceFactory().reloadStatus(findPipeline);

  await fileServiceFactory().delete({ where: { siteId } });

  await pipelineServiceFactory().processFileSearchingStage(findSite.id);

  ctx.body = { success: true };
};
