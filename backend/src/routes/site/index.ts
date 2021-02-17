import Router from '@koa/router';
import getSiteList from '@routes/site/getSiteList';
import updateSite from '@routes/site/updateSite';
import deleteSite from '@routes/site/deleteSite';

const router = new Router();

router.prefix('/api/v1/site');

router.get('/list', getSiteList);

router.put('/', updateSite);

router.delete('/:siteId', deleteSite);

export default router;
