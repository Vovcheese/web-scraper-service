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
const index_2 = __importDefault(require("@services/domain/Translation/index"));
const index_3 = __importDefault(require("@services/domain/Pipline/index"));
const interfaces_1 = require("@db/interfaces");
exports.default = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const siteId = Number(ctx.params.siteId);
    const body = ctx.request.body;
    const findSite = yield index_1.default.findOne({ where: { id: siteId } });
    if (!findSite) {
        throw new Error('Site not found');
    }
    const findPipeline = yield index_3.default.findOne({
        where: {
            siteId,
            type: interfaces_1.ETypePipeline.GENERATEID,
        },
    });
    if (findPipeline.status !== interfaces_1.EStatus.ERROR) {
        throw new Error('The pipeline cannot be started');
    }
    yield index_3.default.reloadStatus(findPipeline);
    yield index_2.default.delete({ where: { siteId, default: false } });
    yield index_1.default.processGenerateTextIdsStage(findSite.id, body.langList, findSite.url);
    ctx.body = { success: true };
});
