import { Context } from 'koa';
import Router from '@koa/router';

import scrape from '@routes/scrape/index';
import site from '@routes/site/index';
import text from '@routes/translate/index';
import file from '@routes/file/index';
import auth from '@routes/auth/index';
import pipeline from '@routes/pipeline/index';
import render from '@routes/render/index';

const router = new Router();

router.use(render.routes());
router.use(render.allowedMethods());

router.use(auth.routes());
router.use(auth.allowedMethods());

router.use(scrape.routes());
router.use(scrape.allowedMethods());

router.use(site.routes());
router.use(site.allowedMethods());

router.use(text.routes());
router.use(text.allowedMethods());

router.use(file.routes());
router.use(file.allowedMethods());

router.use(pipeline.routes());
router.use(pipeline.allowedMethods());




export default router;
