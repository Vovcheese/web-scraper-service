
import { Context } from 'koa';
import { 
  siteServiceFactory
} from '@services/index';

export default async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId);

  await siteServiceFactory().removeSiteFolder(siteId);

  const findSite = await siteServiceFactory().findOne({ where: { id: siteId } });

  await findSite.destroy();

  ctx.body = { success: true };
};
