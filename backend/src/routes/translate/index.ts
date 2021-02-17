import Router from '@koa/router';
import getTranslateList from '@routes/translate/getTranslateList';
import updateTranslate from '@routes/translate/updateTranslate';

const router = new Router();

router.prefix('/api/v1/translate');

router.get('/list/:siteId/:lang', getTranslateList);

router.patch('/:translateId/', updateTranslate);

export default router;
