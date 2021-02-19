"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationService = void 0;
const index_1 = __importDefault(require("@models/index"));
const BaseCRUD_1 = __importDefault(require("@services/domain/BaseCRUD"));
class TranslationService extends BaseCRUD_1.default {
    constructor(userRepositiory) {
        super(userRepositiory);
        this.userRepositiory = userRepositiory;
    }
}
exports.TranslationService = TranslationService;
exports.default = new TranslationService(index_1.default.userRepository);
