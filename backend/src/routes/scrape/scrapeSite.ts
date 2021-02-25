import uuid from 'uuid';
import { Context } from 'koa';
import siteService from '@services/domain/Site/index';
import pipelineService from '@services/domain/Pipline/index';

interface IScrapeBody {
  name: string;
  link: string;
  languages: string[];
}

export default async (ctx: Context) => {
  const domain = ctx.request.header.host;
  const body: IScrapeBody = ctx.request.body;

  if (!body.name) {
    body.name = uuid.v4();
  }

  const findSite = await siteService.findOne({
    where: { name: body.name },
  });

  if (findSite) {
    throw new Error('A site with the same name already exists');
  }

  const site = await siteService.create({
    domain,
    name: body.name,
    url: body.link,
  });

  const langList = body.languages || [];

  pipelineService
    .processDownloadStage(site.id, site.url)
    .then((_) => pipelineService.processFileSearchingStage(site.id))
    .then((_) => pipelineService.processGenerateTextIdsStage(site.id, langList, site.url));

  ctx.body = { success: true };
};
