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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@services/auth/index");
exports.default = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    return next();
    const authHeader = ctx.request.headers['authorization'];
    if (!authHeader)
        return ctx.status = 403;
    if (!authHeader.startsWith('Bearer'))
        return ctx.status = 403;
    const token = authHeader.split('Bearer')[1];
    const verify = index_1.authService.verifyAccessJWT(token);
    if (!verify)
        return ctx.status = 403;
    ctx.user = verify;
    yield next();
});
