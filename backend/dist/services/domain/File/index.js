"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const index_1 = __importDefault(require("@models/index"));
const BaseCRUD_1 = __importDefault(require("@services/domain/BaseCRUD"));
class FileService extends BaseCRUD_1.default {
    constructor(translationRepositiory) {
        super(translationRepositiory);
        this.translationRepositiory = translationRepositiory;
    }
}
exports.FileService = FileService;
exports.default = new FileService(index_1.default.fileRepository);
