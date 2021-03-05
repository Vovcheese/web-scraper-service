import { Context } from "koa";
import { 
    renderServiceFactory,
    siteServiceFactory
} from '@services/index';
import path from 'path';

export default async (ctx: Context) => {
    const domain = ctx.header.host;
    let lang = ctx.params.lang;
    let fileName = "index.html";
    const ext = path.extname(lang);

    if(ext && ext === '.html') {
        fileName = lang;
        const findSite = await siteServiceFactory().findOne(
            {
                where: {
                    domain,
                    active: true
                }
            }
        )

        if(!findSite) return ctx.status = 404;

        lang = findSite.lang;
    }
    
    const result = await renderServiceFactory().getRenderData(domain, fileName, lang);

    await ctx.render(`${result.siteId}/${fileName}`, result.data);
}
  