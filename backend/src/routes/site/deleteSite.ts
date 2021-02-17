
import { Context } from 'koa';
import siteService from '@services/domain/Site/index';

export default async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId);

  const findSite = await siteService.findOne({ where: { id: siteId } });

  await findSite.destroy();

  await siteService.removeSiteFolder(siteId);

  ctx.body = { success: true };
};
