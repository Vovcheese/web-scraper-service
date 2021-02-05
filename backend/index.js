const Koa = require('koa');
const static = require('koa-static');
const path = require('path')
const app = new Koa();
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const hbs = require('koa-views-handlebars');
require('./cron')

global.appRoot = path.resolve(__dirname);

const routes = require('./routes')

app.use(static(path.resolve(__dirname,'views')));
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

app.use(hbs(__dirname , {
    partialDirs: __dirname + '/views',
    extension: 'html' 
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

app.on('error', (err, ctx) => {
    console.log('Error', err)
});

app.listen(4040, () => {
    console.log('server listening 4040 port')
    // parse(path.resolve(__dirname, 'views','test', 'index.html'))
});