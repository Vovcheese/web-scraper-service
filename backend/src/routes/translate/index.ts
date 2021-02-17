import Router from '@koa/router';
import getTranslateList from '@routes/translate/getTranslateList';
import updateTranslate from '@routes/translate/updateTranslate';
import authMiddleware from '@middlewares/auth';

const router = new Router();

router.use(authMiddleware);

router.prefix('/api/v1/translate');

router.get('/list/:siteId/:lang', getTranslateList);

router.patch('/:translateId/', updateTranslate);

export default router;
