
import { Context } from 'koa';
import { 
  siteServiceFactory
} from '@services/index';
import { op } from '@db/index';

export default async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId);

  const findSite = await siteServiceFactory().findOne({ where: { id: siteId } });

  findSite.active = !findSite.active;

  await siteServiceFactory().update({ active: false }, { where: { domain: findSite.domain, id: {
    [op.ne]: findSite.id,
  } } });

  await findSite.save();

  ctx.body = { success: true };
};
