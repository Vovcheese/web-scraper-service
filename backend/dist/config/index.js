"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const host = 'http://localhost';
const port = 4040;
const config = {
    app: {
        auth: {
            accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
            accessTokenLife: process.env.ACCESS_TOKEN_LIFE,
            refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
            refreshTokenLife: process.env.REFRESH_TOKEN_LIFE,
        },
    },
    server: {
        host,
        port,
    },
    bd: {
        mysql: {
            repositoryMode: true,
            host: process.env.MYSQL_HOST || 'localhost',
            port: process.env.MYSQL_PORT || 4306,
            database: process.env.MYSQL_DB || 'scraper',
            dialect: 'mariadb',
            username: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || 'my-secret-pw',
            storage: ':memory:',
            models: [path_1.resolve(`${process.cwd()}/src/db/models/**/*.model.ts`)],
            logging: process.env.NODE_ENV === 'development',
        },
    },
};
exports.default = config;
