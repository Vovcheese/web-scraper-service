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
exports.PiplineService = void 0;
const index_1 = __importDefault(require("@models/index"));
const BaseCRUD_1 = __importDefault(require("@services/domain/BaseCRUD"));
const interfaces_1 = require("@db/interfaces");
const index_2 = __importDefault(require("@services/socket/index"));
class PiplineService extends BaseCRUD_1.default {
    constructor(pipelineRepositiory) {
        super(pipelineRepositiory);
        this.pipelineRepositiory = pipelineRepositiory;
    }
    createPipeline(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bulkCreate([
                { siteId, type: interfaces_1.ETypePipeline.DOWNLOAD },
                { siteId, type: interfaces_1.ETypePipeline.FILESEARCHING },
                { siteId, type: interfaces_1.ETypePipeline.GENERATEID },
                { siteId, type: interfaces_1.ETypePipeline.TRANSLATING },
            ]);
        });
    }
    changeStatus(siteId, status, type, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = { status };
            if (error) {
                obj.error = error;
            }
            index_2.default.emit('UPDATE_STATUS_PIPELINE', { siteId, type, status, error });
            return this.update(obj, { where: { siteId, type } });
        });
    }
    reloadStatus(findModel) {
        return __awaiter(this, void 0, void 0, function* () {
            findModel.status = interfaces_1.EStatus.PENDING;
            findModel.error = null;
            yield findModel.save();
        });
    }
}
exports.PiplineService = PiplineService;
exports.default = new PiplineService(index_1.default.pipelineRepository);
