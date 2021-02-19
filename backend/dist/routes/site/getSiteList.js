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
const index_1 = __importDefault(require("@services/domain/Site/index"));
const index_2 = __importDefault(require("@services/domain/File/index"));
const index_3 = __importDefault(require("@services/domain/Translation/index"));
const index_4 = __importDefault(require("@models/index"));
exports.default = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const domain = ctx.header.host;
    const page = Number(ctx.query.page) || 1;
    const limit = Number(ctx.query.pageSize) || 50;
    const list = (yield index_1.default.list({
        include: [index_4.default.pipelineRepository],
        where: { domain },
    }, page, limit));
    const countFiles = (yield index_2.default.count({
        attributes: ['siteId'],
        where: {
            ext: '.html',
        },
        group: 'siteId',
    }));
    const countTexts = (yield index_3.default.count({
        attributes: ['siteId'],
        group: 'siteId',
    }));
    const mapCountFiles = countFiles.reduce((acc, result) => {
        if (!acc[result.siteId])
            acc[result.siteId] = result.count;
        return acc;
    }, {});
    const mapCountTexts = countTexts.reduce((acc, result) => {
        if (!acc[result.siteId])
            acc[result.siteId] = result.count;
        return acc;
    }, {});
    list.rows = list.rows.map((site) => {
        const siteJson = site.toJSON();
        siteJson.countFiles = mapCountFiles[site.id] || 0;
        siteJson.countWords = mapCountTexts[site.id] || 0;
        return siteJson;
    });
    ctx.body = Object.assign(Object.assign({}, list), { page, limit });
});
