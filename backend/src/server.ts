import 'reflect-metadata';
import './moduleAlias';

import Koa from 'koa';
import path from 'path';
import koaBody from 'koa-body';
import cors from 'koa-cors';
import hbs from 'koa-views-handlebars';
import routes from '@routes/index';
import staticMiddleware from '@middlewares/static';
import dotenv from 'dotenv';

dotenv.config()

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
  })
);

app.use(koaBody({ multipart: true }));
app.use(cors({
  origin: "http://localhost:8080",
}));

app.use(staticMiddleware);

app.use(routes.routes()).use(routes.allowedMethods());

export default app;
