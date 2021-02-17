import Router from '@koa/router';
import login from '@routes/auth/login';

import authMiddleware from '@middlewares/auth';

const router = new Router();

router.prefix('/api/v1/auth');

router.get('/me', authMiddleware , login);

router.post('/login', login);

export default router;
