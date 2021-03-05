import { Context } from "koa";
import { 
  siteServiceFactory,
  renderServiceFactory
} from '@services/index';

export default async (ctx: Context) => {
    const domain = ctx.header.host
    const fileName = "index.html";

    const findSite = await siteServiceFactory().findOne({
      where: { domain, active: true },
    })
  
    if (!findSite) {
      return (ctx.status = 404)
    }
  
    const result = await renderServiceFactory().getRenderData(domain, fileName, findSite.lang);

    if (Object.keys(result.data).length) {
        await ctx.render(`${result.siteId}/${fileName}`, result.data)
    }
  }