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
const index_1 = __importDefault(require("@services/domain/Translation/index"));
exports.default = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const siteId = Number(ctx.params.siteId);
    const lang = ctx.query.lang || 'all';
    const page = Number(ctx.query.page) || 1;
    const limit = Number(ctx.query.pageSize) || 50;
    const whereObj = { siteId };
    if (lang !== 'all') {
        whereObj.lang = lang;
    }
    const list = yield index_1.default.list({
        where: Object.assign({}, whereObj),
    }, page, limit);
    ctx.body = Object.assign(Object.assign({}, list), { page, limit });
});
