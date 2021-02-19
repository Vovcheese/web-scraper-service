"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const app_1 = __importDefault(require("../../app"));
const ioserver = new socket_io_1.default.Server(app_1.default);
ioserver.on('connection', (socket) => {
    console.log('Connection', socket);
});
exports.default = ioserver;
