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
exports.SiteService = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("@models/index"));
const BaseCRUD_1 = __importDefault(require("@services/domain/BaseCRUD"));
const index_2 = require("@services/scraper/index");
const index_3 = __importDefault(require("@services/domain/Pipline/index"));
const interfaces_1 = require("@db/interfaces");
class SiteService extends BaseCRUD_1.default {
    constructor(siteRepositiory, webScraperService, pipelineService) {
        super(siteRepositiory);
        this.siteRepositiory = siteRepositiory;
        this.webScraperService = webScraperService;
        this.pipelineService = pipelineService;
    }
    // Stage 1
    processDownloadStage(siteId, link) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pipelineService.createPipeline(siteId);
            try {
                const options = {
                    urls: [link],
                    directory: path_1.default.resolve(process.cwd(), 'views', String(siteId)),
                };
                yield this.pipelineService.changeStatus(siteId, interfaces_1.EStatus.PROGRESS, interfaces_1.ETypePipeline.DOWNLOAD);
                const startTime = Date.now();
                yield this.webScraperService.downloadSite(options);
                const endTime = Date.now() - startTime;
                this.pipelineService.update({ time: endTime }, { where: { siteId, type: interfaces_1.ETypePipeline.DOWNLOAD } });
                yield this.pipelineService.changeStatus(siteId, interfaces_1.EStatus.SUCCESS, interfaces_1.ETypePipeline.DOWNLOAD);
            }
            catch (error) {
                yield this.pipelineService.changeStatus(siteId, interfaces_1.EStatus.ERROR, interfaces_1.ETypePipeline.DOWNLOAD, error.message);
                throw new Error(error);
            }
        });
    }
    // Stage 2
    processFileSearchingStage(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.pipelineService.changeStatus(siteId, interfaces_1.EStatus.PROGRESS, interfaces_1.ETypePipeline.FILESEARCHING);
                const startTime = Date.now();
                yield this.webScraperService.parseSiteFolder(siteId);
                const endTime = Date.now() - startTime;
                this.pipelineService.update({ time: endTime }, { where: { siteId, type: interfaces_1.ETypePipeline.FILESEARCHING } });
                yield this.pipelineService.changeStatus(siteId, interfaces_1.EStatus.SUCCESS, interfaces_1.ETypePipeline.FILESEARCHING);
            }
            catch (error) {
                yield this.pipelineService.changeStatus(siteId, interfaces_1.EStatus.ERROR, interfaces_1.ETypePipeline.FILESEARCHING, error.message);
                throw new Error(error);
            }
        });
    }
    // Stage 3
    processGenerateTextIdsStage(siteId, langList, domain) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.pipelineService.changeStatus(siteId, interfaces_1.EStatus.PROGRESS, interfaces_1.ETypePipeline.GENERATEID);
                const startTime = Date.now();
                yield this.webScraperService.generateTextIds(siteId, langList, domain);
                const endTime = Date.now() - startTime;
                this.pipelineService.update({ time: endTime }, { where: { siteId, type: interfaces_1.ETypePipeline.GENERATEID } });
                yield this.pipelineService.changeStatus(siteId, interfaces_1.EStatus.SUCCESS, interfaces_1.ETypePipeline.GENERATEID);
            }
            catch (error) {
                console.log(error);
                yield this.pipelineService.changeStatus(siteId, interfaces_1.EStatus.ERROR, interfaces_1.ETypePipeline.GENERATEID, error.message);
                throw new Error(error);
            }
        });
    }
    removeSiteFolder(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pathFolder = path_1.default.join(process.cwd(), 'views', String(siteId));
            try {
                yield fs_1.promises.stat(pathFolder);
                yield fs_1.promises.rmdir(pathFolder, { recursive: true });
            }
            catch (e) { }
        });
    }
}
exports.SiteService = SiteService;
exports.default = new SiteService(index_1.default.siteRepository, index_2.webScraperService, index_3.default);
