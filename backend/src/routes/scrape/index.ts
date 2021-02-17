import Router from '@koa/router';
import scrapeSite from '@routes/scrape/scrapeSite';

const router = new Router();

router.prefix('/api/v1/scrape');

router.post('/', scrapeSite);

export default router;
