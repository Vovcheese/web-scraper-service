import Router from '@koa/router';
import getSiteList from '@routes/site/getSiteList';
import updateSite from '@routes/site/updateSite';
import deleteSite from '@routes/site/deleteSite';
import authMiddleware from '@middlewares/auth';

const router = new Router();

router.use(authMiddleware);

router.prefix('/api/v1/site');

router.get('/list', getSiteList);

router.put('/', updateSite);

router.delete('/:siteId', deleteSite);

export default router;
