"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const getTranslateList_1 = __importDefault(require("@routes/translate/getTranslateList"));
const addTranslate_1 = __importDefault(require("@routes/translate/addTranslate"));
const updateTranslate_1 = __importDefault(require("@routes/translate/updateTranslate"));
const auth_1 = __importDefault(require("@middlewares/auth"));
const router = new router_1.default();
router.use(auth_1.default);
router.prefix('/api/v1/translations');
router.get('/list/:siteId', getTranslateList_1.default);
router.post('/add/:siteId', addTranslate_1.default);
router.patch('/:translateId/', updateTranslate_1.default);
exports.default = router;
