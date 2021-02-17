import Router from '@koa/router';
import getFileList from '@routes/file/getFileList';

const router = new Router();

router.prefix('/api/v1/file');

router.get('/list/:siteId', getFileList);

export default router;
