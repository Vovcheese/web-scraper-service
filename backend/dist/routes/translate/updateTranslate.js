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
    const translateId = Number(ctx.params.translateId);
    const body = ctx.request.body;
    const findTranslation = yield index_1.default.findOne({
        where: { id: translateId },
    });
    if (!findTranslation) {
        throw new Error('Translation not found');
    }
    if (findTranslation.default) {
        throw new Error('Default translate not editable');
    }
    findTranslation.text = body.text;
    yield findTranslation.save();
    ctx.body = Object.assign({}, findTranslation);
});
