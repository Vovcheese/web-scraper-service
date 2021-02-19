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
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const index_1 = __importDefault(require("@config/index"));
class AuthService {
    constructor(userService) {
        this.userService = userService;
    }
    register(body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!body.login || !body.password)
                throw new Error('Неверные данные');
            const findUser = yield this.userService.findOne({ where: { email: body.login } });
            if (findUser)
                throw new Error('Пользователь с данным email уже существует');
            const password = this.generatePassword(body.password);
            const createdUser = yield this.userService.create({ password, login: body.login });
            return createdUser;
        });
    }
    login(body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!body.login || !body.password)
                throw new Error('Неверные данные');
            const findUser = yield this.userService.findOne({ where: { login: body.login } });
            if (!findUser)
                throw new Error('Пользователь с данным email не существует');
            if (!this.verifyPassword(findUser.password, body.password))
                throw new Error('Введен не верный пароль');
            delete findUser.password;
            return Object.assign({ user: findUser }, this.generateJWT(findUser));
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshTokenVerify = this.verifyRefreshJWT(refreshToken);
            if (!refreshTokenVerify)
                throw new Error('Refresh token not valid');
            const findUser = yield this.userService.findOne({ where: { id: refreshTokenVerify.id } });
            return this.generateJWT(findUser);
        });
    }
    generateJWT(payload) {
        if (!payload)
            return false;
        const accessToken = jsonwebtoken_1.sign(payload.toJSON(), index_1.default.app.auth.accessTokenSecret, {
            algorithm: 'HS256',
            expiresIn: index_1.default.app.auth.accessTokenLife,
        });
        const refreshToken = jsonwebtoken_1.sign(payload.toJSON(), index_1.default.app.auth.refreshTokenSecret, {
            algorithm: 'HS256',
            expiresIn: index_1.default.app.auth.refreshTokenLife,
        });
        return { accessToken, refreshToken };
    }
    verifyAccessJWT(token) {
        console.log('token', token);
        return jsonwebtoken_1.verify(token, index_1.default.app.auth.accessTokenSecret);
    }
    verifyRefreshJWT(token) {
        return jsonwebtoken_1.verify(token, index_1.default.app.auth.refreshTokenSecret);
    }
    generatePassword(password) {
        const salt = bcrypt_1.genSaltSync(10);
        const hash = bcrypt_1.hashSync(password, salt);
        return hash;
    }
    verifyPassword(hashedPassword, inputPassword) {
        return bcrypt_1.compareSync(inputPassword, hashedPassword);
    }
}
exports.default = AuthService;
