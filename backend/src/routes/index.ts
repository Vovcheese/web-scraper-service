import { Context } from 'koa';
import Router from '@koa/router';

import scrape from '@routes/scrape/index';
import site from '@routes/site/index';
import text from '@routes/translate/index';
import file from '@routes/file/index';

import siteService from '@services/domain/Site';
import translationService from '@services/domain/Translation/index';

const router = new Router();

router.use(scrape.routes());
router.use(scrape.allowedMethods());

router.use(site.routes());
router.use(site.allowedMethods());

router.use(text.routes());
router.use(text.allowedMethods());

router.use(file.routes());
router.use(file.allowedMethods());

router.get('/:lang', async (ctx: Context) => {
  ctx.redirect(`/${ctx.params.lang}/index.html`);
});

router.get('/:lang/:fileName', async (ctx: Context) => {
  const domain = ctx.header.host;
  const lang = ctx.params.lang || 'default';
  const fileName = ctx.params.fileName || 'index.html';

  const findSite = await siteService.findOne({ where: { domain, active: true } });

  if (!findSite)  {
    return ctx.status = 404;
  }

  const siteId = findSite.id;

  let findTexts = await translationService.findAll({
    where: { lang, siteId },
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

    await ctx.render(`${siteId}/${fileName}`, data);
  }
});


export default router;
