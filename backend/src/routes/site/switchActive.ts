
import { Context } from 'koa';
import siteService from '@services/domain/Site/index';
import { op } from '@db/index';

export default async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId);

  const findSite = await siteService.findOne({ where: { id: siteId } });

  findSite.active = !findSite.active;

  await siteService.update({ active: false }, { where: { domain: findSite.domain, id: {
    [op.ne]: findSite.id,
  } } });

  await findSite.save();

  ctx.body = { success: true };
};
