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
exports.op = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const index_1 = __importDefault(require("@config/index"));
const sequelize = new sequelize_typescript_1.Sequelize(index_1.default.bd.mysql);
exports.op = sequelize_1.Op;
const force = process.env.FORCE_DB === 'true';
sequelize.authenticate().then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('success connect to db force', force);
    if (force) {
        yield sequelize.sync({ force: true });
    }
})).catch((error) => {
    console.error('Unable to connect to the database:', error);
});
exports.default = sequelize;
