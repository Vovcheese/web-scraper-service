import { Context } from 'koa';
import siteService from '@services/domain/Site/index';
import fileService from '@services/domain/File/index';
import pipelineService from '@services/domain/Pipline/index';
import { EStatus, ETypePipeline } from '@db/interfaces';

export default async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId);

  const findSite = await siteService.findOne({ where: { id: siteId } });

  if (!findSite) {
    throw new Error('Site not found');
  }

  const findPipeline = await pipelineService.findOne({
    where: {
      siteId,
      type: ETypePipeline.FILESEARCHING,
    },
  });

  if (findPipeline.status !== EStatus.ERROR) {
    throw new Error('The pipeline cannot be started');
  }

  await pipelineService.reloadStatus(findPipeline);

  await fileService.delete({ where: { siteId } });

  await siteService.processFileSearchingStage(findSite.id);

  ctx.body = { success: true };
};
