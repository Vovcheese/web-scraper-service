import { Context } from 'koa';
import { 
  siteServiceFactory
} from '@services/index';
import SiteModel from '@db/models/Site.model';

export default async (ctx: Context) => {
  const body: Partial<SiteModel> = ctx.request.body;

  const findSite = await siteServiceFactory().findOne({ where: { id: body.id } });

  if (!findSite) {
    throw new Error('Site not found');
  }

  const result = await siteServiceFactory().update(body, { where: { id: body.id } });

  ctx.body = { ...result };
};
