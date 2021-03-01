import { Context } from "koa";
import { renderService } from '@services/render/index';

export default async (ctx: Context) => {
    const domain = ctx.header.host;
    const lang = ctx.params.lang;
    const fileName = "index.html";

    const splitUrl = ctx.url.split('/');
    const file = splitUrl[splitUrl.length - 1];
    const splitFile = file.split('.');
    const ext = splitFile[splitFile.length - 1];

    console.log('splitUrl', splitUrl);
    
    const result = await renderService.getRenderData(domain, fileName, lang);

    console.log(result)
    
    await ctx.render(`${result.siteId}/${fileName}`, result.data);
}
  