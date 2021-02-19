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
const website_scraper_1 = __importDefault(require("website-scraper"));
class WebScraperProvider {
    constructor() {
        this.options = {
            urls: [],
            directory: '',
            sources: [
                { selector: 'img', attr: 'src' },
                { selector: 'link[rel="stylesheet"]', attr: 'href' },
                { selector: 'script', attr: 'src' },
            ],
            recursive: true,
            maxRecursiveDepth: 1,
            maxDepth: 3,
            requestConcurrency: 1,
        };
    }
    setOptions(options) {
        this.options = Object.assign(Object.assign(Object.assign({}, this.options), options), { urlFilter: (url) => url.startsWith(String(options.urls[0])) });
    }
    download() {
        return __awaiter(this, void 0, void 0, function* () {
            yield website_scraper_1.default(this.options);
        });
    }
}
exports.default = WebScraperProvider;
