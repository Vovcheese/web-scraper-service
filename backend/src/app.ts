import 'reflect-metadata';
import 'module-alias/register';

import Koa from 'koa';
import send from 'koa-send';
import path from 'path';
import koaBody from 'koa-bodyparser';
import cors from 'koa-cors';

import hbs from 'koa-views-handlebars';

import config from '@config/index';
import routes from '@routes/index';

import '@db/index';

import siteService from '@services/domain/Site';

const app = new Koa();

const viewsPath = path.join(process.cwd(), 'views');

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

app.on('error', (err) => {
  console.log('Error', err);
});

app.use(
  hbs(viewsPath, {
    viewPath: viewsPath,
    extension: 'html',
  }),
);

app.use(koaBody());
app.use(cors());

app.use(async (ctx, next) => {
  await next();
  const domain = ctx.header.host;
  const findSite = await siteService.findOne({ where: { domain, active: true } });
  const splitUrl = ctx.url.split('/');
  const file = splitUrl[splitUrl.length - 1];
  const splitFile = file.split('.');
  const ext = splitFile[splitFile.length - 1];
  if (!ctx.url.startsWith('/api/v1') && ctx.method === 'GET' && ext !== 'html') {
    const redirectUrl = `${findSite.id}/${splitUrl.slice(2).join('/')}`;
    await send(ctx, redirectUrl, { root: viewsPath });
  }
});

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(routes.routes()).use(routes.allowedMethods());

app.listen(config.server.port, '0.0.0.0', async () => {
  console.log(`Server listening for ${config.server.port} port...`);
});

export default app;