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
const index_1 = __importDefault(require("@services/domain/Translation/index"));
exports.default = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const siteId = Number(ctx.params.siteId);
    const body = ctx.request.body;
    if (!body.langList.length) {
        throw new Error("Lang list is empty");
    }
    const findDefaultTranslate = yield index_1.default.findAll({
        where: { siteId, default: true },
    });
    if (!findDefaultTranslate.length) {
        throw new Error('Default traslates not found');
    }
    const translateObject = [];
    for (const lang of body.langList) {
        for (const defaultTranslate of findDefaultTranslate) {
            const findTranslation = yield index_1.default.findOne({
                where: {
                    siteId,
                    lang,
                    default: false,
                    textId: defaultTranslate.textId
                },
            });
            if (findTranslation) {
                throw new Error(`Translates for lang ${lang} exist`);
            }
            translateObject.push({
                siteId,
                lang,
                text: defaultTranslate.text,
                textId: defaultTranslate.textId,
                default: false,
            });
        }
    }
    yield index_1.default.bulkCreate(translateObject);
    ctx.body = { success: true };
});
