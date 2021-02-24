import Router from '@koa/router';
import getFileList from '@routes/file/getFileList';
import getFile from '@routes/file/getFile';
import authMiddleware from '@middlewares/auth';

const router = new Router();

router.use(authMiddleware);

router.prefix('/api/v1/file');

router.get('/list/:siteId', getFileList);

router.get('/:fileId', getFile);

export default router;
