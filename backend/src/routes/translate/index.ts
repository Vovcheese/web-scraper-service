import Router from '@koa/router';
import getTranslateList from '@routes/translate/getTranslateList';
import addTranslate from '@routes/translate/addTranslate';
import updateTranslate from '@routes/translate/updateTranslate';
import authMiddleware from '@middlewares/auth';

const router = new Router();

router.use(authMiddleware);

router.prefix('/api/v1/translations');

router.get('/list/:siteId', getTranslateList);

router.post('/add/:siteId', addTranslate);

router.patch('/:translateId/', updateTranslate);

export default router;
