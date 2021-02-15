import Router from '@koa/router';
import uuid from 'uuid';
import { Context } from 'koa';
import siteService from '@services/domain/Site/index';

const router = new Router();

router.prefix('/scrape');
interface IScrapeBody {
  siteName: string;
  mainLink: string;
}

router.post('/', async (ctx: Context) => {
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

  const site = await siteService.processDownloadStage(body.siteName, body.mainLink);

  await siteService.processFileSearchingStage(site.id);

  const langList = ['it', 'en', 'ru'];

  await siteService.processGenerateTextIdsStage(site.id, langList);

  ctx.body = { success: true };
});

export default router;
