import { Context } from 'koa';
import siteService from '@services/domain/Site/index';
import SiteModel from '@models/Site.model';

export default async (ctx: Context) => {
  const body: Partial<SiteModel> = ctx.request.body;

  const findSite = await siteService.findOne({ where: { id: body.id } });

  if (!findSite) {
    throw new Error('Site not found');
  }

  const result = await siteService.update(body, { where: { id: body.id } });

  ctx.body = { ...result };
};
