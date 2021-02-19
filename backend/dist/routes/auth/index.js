"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const login_1 = __importDefault(require("@routes/auth/login"));
const auth_1 = __importDefault(require("@middlewares/auth"));
const router = new router_1.default();
router.prefix('/api/v1/auth');
router.get('/me', auth_1.default, login_1.default);
router.post('/login', login_1.default);
exports.default = router;
