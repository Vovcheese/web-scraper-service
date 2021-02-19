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
const index_2 = require("@db/index");
exports.default = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const siteId = Number(ctx.params.siteId);
    const findSite = yield index_1.default.findOne({ where: { id: siteId } });
    findSite.active = !findSite.active;
    yield index_1.default.update({ active: false }, { where: { domain: findSite.domain, id: {
                [index_2.op.ne]: findSite.id,
            } } });
    yield findSite.save();
    ctx.body = { success: true };
});
