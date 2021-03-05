import { Context } from "koa";
import { 
    renderServiceFactory
} from '@services/index';

export default async (ctx: Context) => {
    const domain = ctx.header.host;
    const lang = ctx.params.lang || "default";
    const fileName = ctx.params.fileName || "index.html";

    const result = await renderServiceFactory().getRenderData(domain, fileName, lang)

    if (Object.keys(result.data).length) {
        await ctx.render(`${result.siteId}/${fileName}`, result.data)
    }
  }