import Router from '@koa/router';
import redirectToDefaultLang from '@routes/render/redirectToDefaultLang';
import renderIndex from '@routes/render/renderIndex';
import renderFile from '@routes/render/renderFile';

const router = new Router();

// router.get('/', redirectToDefaultLang);

router.get('/:lang', renderIndex);

router.get('/:lang/:fileName', renderFile);

export default router;
