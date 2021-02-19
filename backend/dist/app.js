"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const module_alias_1 = __importDefault(require("module-alias"));
module_alias_1.default(process.cwd() + '/package.json');
const koa_1 = __importDefault(require("koa"));
const koa_send_1 = __importDefault(require("koa-send"));
const path_1 = __importDefault(require("path"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_cors_1 = __importDefault(require("koa-cors"));
const http_1 = __importDefault(require("http"));
const koa_views_handlebars_1 = __importDefault(require("koa-views-handlebars"));
const index_1 = __importDefault(require("@config/index"));
const index_2 = __importDefault(require("@routes/index"));
require("@db/index");
const Site_1 = __importDefault(require("@services/domain/Site"));
const dotenv_1 = __importDefault(require("dotenv"));
const run_1 = __importDefault(require("@db/run"));
require("@services/socket/index");
dotenv_1.default.config();
const app = new koa_1.default();
const server = http_1.default.createServer(app.callback());
const viewsPath = path_1.default.join(process.cwd(), 'views');
app.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield next();
    }
    catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
}));
app.on('error', (err) => {
    console.log('Error', err);
});
app.use(koa_views_handlebars_1.default(viewsPath, {
    viewPath: viewsPath,
    extension: 'html',
}));
app.use(koa_bodyparser_1.default());
app.use(koa_cors_1.default());
app.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield next();
    const domain = ctx.header.host;
    const splitUrl = ctx.url.split('/');
    const file = splitUrl[splitUrl.length - 1];
    const splitFile = file.split('.');
    const ext = splitFile[splitFile.length - 1];
    if (!ctx.url.startsWith('/api/v1') &&
        ctx.method === 'GET' &&
        ext !== 'html') {
        const findSite = yield Site_1.default.findOne({
            where: { domain, active: true },
        });
        if (!findSite) {
            return ctx.status = 404;
        }
        const redirectUrl = `${findSite.id}/${splitUrl.slice(2).join('/')}`;
        yield koa_send_1.default(ctx, redirectUrl, { root: viewsPath });
    }
}));
app.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
}));
app.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const start = Date.now();
    yield next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
}));
app.use(index_2.default.routes()).use(index_2.default.allowedMethods());
server.listen(index_1.default.server.port, '0.0.0.0', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server listening for ${index_1.default.server.port} port...`);
    yield run_1.default('seeders');
    yield run_1.default('migrations');
}));
exports.default = server;
