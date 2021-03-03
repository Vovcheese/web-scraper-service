import { Context } from "koa";
import siteService from "@services/domain/Site";
import renderService from '@services/render/index';

export default async (ctx: Context) => {
    const domain = ctx.header.host
    const fileName = "index.html";

    const findSite = await siteService.findOne({
      where: { domain, active: true },
    })
  
    if (!findSite) {
      return (ctx.status = 404)
    }
  
    const result = await renderService.getRenderData(domain, fileName, findSite.lang);

    if (Object.keys(result.data).length) {
        await ctx.render(`${result.siteId}/${fileName}`, result.data)
    }
  }