import 'reflect-metadata';
import 'module-alias/register';

import Koa from 'koa';
import staticView from 'koa-static';
import path from 'path';
import koaBody from 'koa-bodyparser';
import cors from 'koa-cors';

import hbs from 'koa-views-handlebars';
import dotenv from 'dotenv';

import config from '@config/index';
import routes from '@routes/index';

import '@db/index';

const app = new Koa();
dotenv.config();

app.use(staticView(path.resolve(__dirname, 'views')));
app.use(koaBody());
app.use(cors());

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

app.use(hbs(__dirname, {
  partialDirs: `${__dirname}/views`,
  extension: 'html',
}));

app
  .use(routes.routes())
  .use(routes.allowedMethods());

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

app.listen(config.server.port, () => {
  console.log(`Server listening for ${config.server.port} port...`);
});

export default app;
