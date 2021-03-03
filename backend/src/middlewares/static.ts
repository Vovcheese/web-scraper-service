import Koa from 'koa';
import send from 'koa-send';
import path from 'path';

import { LANGUAGE_LIST } from '@utils/constants';
import siteService from '@services/domain/Site';

export default async (ctx: Koa.Context, next: Koa.Next) => {
    const domain = ctx.header.host;
    const viewsPath = path.join(process.cwd(), 'views');
    const splitUrl = ctx.url.split('/');
    const ext = path.extname(ctx.url);
    if (
      !ctx.url.startsWith('/api/v1') &&
      ctx.method === 'GET' &&
      ext &&
      ext !== '.html'
    ) {
      const findSite = await siteService.findOne({
        where: { domain, active: true },
      });
    
      if (!findSite) {
        return ctx.status = 404
      }
  
      const staticUrl = []
  
      for (const url of splitUrl) {
        if(url && !LANGUAGE_LIST[url]) {
          staticUrl.push(url)
        }
      }
  
      const redirectUrl = `${findSite.id}/${staticUrl.join('/')}`;
  
      try {
        await send(ctx, redirectUrl, { root: viewsPath });
      } catch (error) {}
      
    }
    await next();
  }