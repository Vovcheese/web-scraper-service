import uuid from 'uuid';
import { Context } from 'koa';
import siteService from '@services/domain/Site/index';

interface IScrapeBody {
  siteName: string;
  mainLink: string;
  langList: string[];
}

export default async (ctx: Context) => {
  const domain = ctx.request.header.host;
  const body: IScrapeBody = ctx.request.body;

  if (!body.siteName) {
    body.siteName = uuid.v4();
  }

  const findSite = await siteService.findOne({
    where: { name: body.siteName },
  });

  if (findSite) {
    throw new Error('A site with the same name already exists');
  }

  const site = await siteService.create({ domain, name: body.siteName, url: body.mainLink });

  await siteService.processDownloadStage(
    site.id,
    site.url,
  );

  await siteService.processFileSearchingStage(site.id);

  const langList = body.langList || [];

  await siteService.processGenerateTextIdsStage(site.id, langList);

  ctx.body = { success: true };
};
