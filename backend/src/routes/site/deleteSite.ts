
import { Context } from 'koa';
import siteService from '@services/domain/Site/index';

export default async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId);

  await siteService.removeSiteFolder(siteId);

  const findSite = await siteService.findOne({ where: { id: siteId } });

  await findSite.destroy();

  ctx.body = { success: true };
};
