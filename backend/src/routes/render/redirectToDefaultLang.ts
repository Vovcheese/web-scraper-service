import { Context } from "koa";
import siteService from "@services/domain/Site";

export default async (ctx: Context) => {
    const domain = ctx.header.host
    const findSite = await siteService.findOne({
      where: { domain, active: true },
    })
  
    if (!findSite) {
      return (ctx.status = 404)
    }
  
    await ctx.redirect(`/${findSite.lang}/`)
  }