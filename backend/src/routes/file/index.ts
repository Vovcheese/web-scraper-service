import Router from '@koa/router';
import getFileList from '@routes/file/getFileList';
import authMiddleware from '@middlewares/auth';

const router = new Router();

router.use(authMiddleware);

router.prefix('/api/v1/file');

router.get('/list/:siteId', getFileList);

export default router;
