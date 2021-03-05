import { Context } from 'koa';
import { siteServiceFactory, pipelineServiceFactory } from '@services/index';
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
      type: ETypePipeline.DOWNLOAD,
    },
  });

  if (findPipeline.status !== EStatus.ERROR) {
    throw new Error('The pipeline cannot be started');
  }

  await pipelineServiceFactory().reloadStatus(findPipeline);

  await siteServiceFactory().removeSiteFolder(siteId);

  await pipelineServiceFactory().processDownloadStage(findSite.id, findSite.url);

  ctx.body = { success: true };
};
