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
const router_1 = __importDefault(require("@koa/router"));
const index_1 = __importDefault(require("@routes/scrape/index"));
const index_2 = __importDefault(require("@routes/site/index"));
const index_3 = __importDefault(require("@routes/translate/index"));
const index_4 = __importDefault(require("@routes/file/index"));
const index_5 = __importDefault(require("@routes/auth/index"));
const Site_1 = __importDefault(require("@services/domain/Site"));
const index_6 = __importDefault(require("@services/domain/Translation/index"));
const router = new router_1.default();
router.use(index_5.default.routes());
router.use(index_5.default.allowedMethods());
router.use(index_1.default.routes());
router.use(index_1.default.allowedMethods());
router.use(index_2.default.routes());
router.use(index_2.default.allowedMethods());
router.use(index_3.default.routes());
router.use(index_3.default.allowedMethods());
router.use(index_4.default.routes());
router.use(index_4.default.allowedMethods());
router.get('/:lang', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.redirect(`/${ctx.params.lang}/index.html`);
}));
router.get('/:lang/:fileName', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const domain = ctx.header.host;
    const lang = ctx.params.lang || 'default';
    const fileName = ctx.params.fileName || 'index.html';
    const findSite = yield Site_1.default.findOne({ where: { domain, active: true } });
    if (!findSite) {
        return ctx.status = 404;
    }
    const siteId = findSite.id;
    let findTexts = yield index_6.default.findAll({
        where: { lang, siteId },
    });
    if (findTexts && findTexts.length === 0) {
        findTexts = yield index_6.default.findAll({
            where: { siteId, default: true },
        });
    }
    if (findTexts && findTexts.length) {
        const data = findTexts.reduce((acc, i) => {
            if (!acc[i.textId])
                acc[i.textId] = i.text;
            return acc;
        }, {});
        yield ctx.render(`${siteId}/${fileName}`, data);
    }
}));
exports.default = router;
