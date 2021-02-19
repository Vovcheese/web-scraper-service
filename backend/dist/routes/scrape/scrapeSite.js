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
const uuid_1 = __importDefault(require("uuid"));
const index_1 = __importDefault(require("@services/domain/Site/index"));
exports.default = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const domain = ctx.request.header.host;
    const body = ctx.request.body;
    if (!body.name) {
        body.name = uuid_1.default.v4();
    }
    const findSite = yield index_1.default.findOne({
        where: { name: body.name },
    });
    if (findSite) {
        throw new Error('A site with the same name already exists');
    }
    const site = yield index_1.default.create({
        domain,
        name: body.name,
        url: body.link,
    });
    const langList = body.languages || [];
    index_1.default
        .processDownloadStage(site.id, site.url)
        .then((_) => index_1.default.processFileSearchingStage(site.id))
        .then((_) => index_1.default.processGenerateTextIdsStage(site.id, langList, site.url));
    ctx.body = { success: true };
});
