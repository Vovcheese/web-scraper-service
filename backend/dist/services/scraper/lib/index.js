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
const cheerio_1 = __importDefault(require("cheerio"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const interfaces_1 = require("@db/interfaces");
class ScraperService {
    constructor(scraperProvider, fileService, translationService) {
        this.scraperProvider = scraperProvider;
        this.fileService = fileService;
        this.translationService = translationService;
    }
    downloadSite(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.scraperProvider.setOptions(options);
            yield this.scraperProvider.download();
        });
    }
    parseSiteFolder(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pathFolder = path_1.default.join(process.cwd(), 'views', String(siteId));
            yield fs_1.promises.stat(pathFolder);
            const files = yield fs_1.promises.readdir(pathFolder);
            for (const file of files) {
                const pathFile = path_1.default.join(pathFolder, file);
                const stats = yield fs_1.promises.lstat(pathFile);
                const isFolder = stats.isDirectory();
                const ext = path_1.default.extname(pathFile);
                const fileName = path_1.default.basename(pathFile);
                const size = stats.size;
                const findFile = yield this.fileService.findOne({
                    where: {
                        isFolder,
                        ext,
                        fileName,
                        size,
                        siteId,
                    },
                });
                if (!findFile) {
                    yield this.fileService.create({
                        isFolder,
                        ext,
                        fileName,
                        size,
                        siteId,
                    });
                }
            }
        });
    }
    generateTextIds(siteId, langList, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const findFiles = yield this.fileService.findAll({
                where: { siteId, ext: '.html', isFolder: false },
            });
            for (const file of findFiles) {
                try {
                    file.status = interfaces_1.EStatus.PROGRESS;
                    file.error = null;
                    yield file.save();
                    const folder = path_1.default.join(process.cwd(), 'views', String(siteId));
                    const pathFile = path_1.default.join(folder, file.fileName);
                    const loadFile = yield fs_1.promises.readFile(pathFile, 'utf-8');
                    const $ = cheerio_1.default.load(loadFile);
                    const childrens = $('body').children();
                    const domain = url.split('/').slice(0, 3).join('/');
                    const result = yield this.searchTextNodeFile($, childrens, siteId, domain, file.id, langList);
                    yield fs_1.promises.writeFile(pathFile, result.html(), 'utf-8');
                    file.status = interfaces_1.EStatus.SUCCESS;
                    yield file.save();
                }
                catch (error) {
                    file.status = interfaces_1.EStatus.ERROR;
                    file.error = error.message;
                    yield file.save();
                    throw new Error(error);
                }
            }
        });
    }
    searchTextNodeFile($, childrens, siteId, domain, fileId, langList) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const [_, child] of Object.entries(childrens)) {
                if (child.type === 'tag') {
                    if (child.name === 'a') {
                        if (child.attribs && child.attribs.href && child.attribs.href.startsWith(domain)) {
                            child.attribs.href = child.attribs.href.split(domain)[1];
                            if (!child.attribs.href.endsWith('.html')) {
                                const startSlice = child.attribs.href[0] === '/' ? 1 : 0;
                                child.attribs.href = `${child.attribs.href.slice(startSlice, -1)}.html`;
                                const split = child.attribs.href.split('/');
                                child.attribs.href = split[split.length - 1];
                            }
                        }
                    }
                    if (child.children) {
                        yield this.searchTextNodeFile($, child.children, siteId, domain, fileId, langList);
                    }
                }
                else if (child.type === 'text') {
                    if (child.data.trim().length > 1) {
                        const id = uuid_1.default.v4();
                        const text = child.data;
                        if (text.indexOf('{{') === -1 && text.indexOf('}}') === -1) {
                            const wrap = $(child).wrap('<span></span>');
                            const parent = $(wrap.parent());
                            const promises = [];
                            promises.push(this.translationService.create({
                                siteId,
                                fileId,
                                text,
                                textId: id,
                                default: true,
                            }));
                            for (const lang of langList) {
                                promises.push(this.translationService.create({
                                    siteId,
                                    fileId,
                                    text,
                                    lang,
                                    textId: id,
                                    default: false,
                                }));
                            }
                            yield Promise.all(promises);
                            parent.text(`{{${id}}}`);
                        }
                    }
                }
            }
            return $;
        });
    }
}
exports.default = ScraperService;
