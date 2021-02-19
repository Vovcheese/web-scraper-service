"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webScraperService = void 0;
const index_1 = __importDefault(require("./lib/index"));
const WebScraperProvider_1 = __importDefault(require("./lib/providers/WebScraperProvider"));
const index_2 = __importDefault(require("@services/domain/File/index"));
const index_3 = __importDefault(require("@services/domain/Translation/index"));
exports.webScraperService = new index_1.default(new WebScraperProvider_1.default(), index_2.default, index_3.default);
