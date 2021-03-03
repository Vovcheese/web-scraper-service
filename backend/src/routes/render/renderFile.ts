import { Context } from "koa";
import renderService from '@services/render/index';

export default async (ctx: Context) => {
    const domain = ctx.header.host;
    const lang = ctx.params.lang || "default";
    const fileName = ctx.params.fileName || "index.html";

    const result = await renderService.getRenderData(domain, fileName, lang)

    if (Object.keys(result.data).length) {
        await ctx.render(`${result.siteId}/${fileName}`, result.data)
    }
  }