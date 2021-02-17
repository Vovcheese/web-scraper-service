import Router from '@koa/router';
import scrapeSite from '@routes/scrape/scrapeSite';
import authMiddleware from '@middlewares/auth';

const router = new Router();

router.use(authMiddleware);

router.prefix('/api/v1/scrape');

router.post('/', scrapeSite);

export default router;
