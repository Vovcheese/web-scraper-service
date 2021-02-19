"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const getFileList_1 = __importDefault(require("@routes/file/getFileList"));
const auth_1 = __importDefault(require("@middlewares/auth"));
const router = new router_1.default();
router.use(auth_1.default);
router.prefix('/api/v1/file');
router.get('/list/:siteId', getFileList_1.default);
exports.default = router;
