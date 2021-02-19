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
exports.down = exports.up = void 0;
const index_1 = require("@services/auth/index");
const index_2 = __importDefault(require("@services/domain/User/index"));
const users = [
    { login: "v0vcheese@account.com", password: index_1.authService.generatePassword('12345'), name: "Володя" },
];
const up = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const user of users) {
        const findUser = yield index_2.default.findOne({ where: { login: user.login } });
        if (!findUser) {
            yield index_2.default.create(user);
        }
    }
});
exports.up = up;
const down = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const user of users) {
        const findUser = yield index_2.default.findOne({ where: { login: user.login } });
        yield findUser.destroy();
    }
});
exports.down = down;
