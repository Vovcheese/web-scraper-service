import { Context } from 'koa';
import Router from '@koa/router';

import scrape from '@routes/scrape/index';
import siteService from '@services/domain/Site';

const router = new Router();

router.get('/:name/:lang', async (ctx: Context) => {
  const findSite = await siteService.findOne({
    where: { name: ctx.params.name, statusParse: 'SUCCESS' },
  });
  if (findSite) {
    let findTexts = await siteService.findAll({
      where: { siteId: findSite.id, lang: ctx.params.lang },
    });

    if (findTexts && findTexts.length === 0) {
      findTexts = await siteService.findAll({
        where: { siteId: findSite.id, default: true },
      });
    }

    if (findTexts && findTexts.length) {
      const data = findTexts.reduce((acc: any, i: any) => {
        if (!acc[i.key]) acc[i.key] = i.value;
        return acc;
      },                            {});

      await ctx.render(`views/${ctx.params.name}/index`, data);
    }
  }
});

router.use(scrape.routes());
router.use(scrape.allowedMethods());

export default router;
