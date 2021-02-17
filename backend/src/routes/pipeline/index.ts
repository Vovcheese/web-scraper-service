import Router from '@koa/router';
import reloadDownloadStage from '@routes/pipeline/reloadDownloadStage';
import reloadFileSearchingStage from '@routes/pipeline/reloadFileSearchingStage';
import reloadGeneratingIdsStage from '@routes/pipeline/reloadGeneratingIdsStage';
import authMiddleware from '@middlewares/auth';

const router = new Router();

router.use(authMiddleware);

router.prefix('/api/v1/pipeline');

router.post('/reload/download/:siteId', reloadDownloadStage);

router.post('/reload/fileSearching/:siteId', reloadFileSearchingStage);

router.post('/reload/generatingIds/:siteId', reloadGeneratingIdsStage);

export default router;
