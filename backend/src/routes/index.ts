import { Context } from 'koa';
import Router from '@koa/router';

import scrape from '@routes/scrape/index';
import siteService from '@services/domain/Site';
import translationService from '@services/domain/Translation/index';

const router = new Router();

router.get('/:siteId/:lang', async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId);
  const lang = ctx.params.lang;

  let findTexts = await translationService.findAll({
    where: { siteId, lang },
  });

  if (findTexts && findTexts.length === 0) {
    findTexts = await translationService.findAll({
      where: { siteId, default: true },
    });
  }

  if (findTexts && findTexts.length) {
    const data = findTexts.reduce((acc: any, i: any) => {
      if (!acc[i.textId]) acc[i.textId] = i.text;
      return acc;
    }, {});
    // console.log(data);
    await ctx.render(`views/${siteId}/index`, data);
  }
});

router.use(scrape.routes());
router.use(scrape.allowedMethods());

export default router;
