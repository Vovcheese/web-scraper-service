"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const AuthService_1 = __importDefault(require("./AuthService"));
const index_1 = __importDefault(require("@services/domain/User/index"));
exports.authService = new AuthService_1.default(index_1.default);
