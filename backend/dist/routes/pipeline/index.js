"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const reloadDownloadStage_1 = __importDefault(require("@routes/pipeline/reloadDownloadStage"));
const reloadFileSearchingStage_1 = __importDefault(require("@routes/pipeline/reloadFileSearchingStage"));
const reloadGeneratingIdsStage_1 = __importDefault(require("@routes/pipeline/reloadGeneratingIdsStage"));
const auth_1 = __importDefault(require("@middlewares/auth"));
const router = new router_1.default();
router.use(auth_1.default);
router.prefix('/api/v1/pipeline');
router.post('/reload/download/:siteId', reloadDownloadStage_1.default);
router.post('/reload/fileSearching/:siteId', reloadFileSearchingStage_1.default);
router.post('/reload/generatingIds/:siteId', reloadGeneratingIdsStage_1.default);
exports.default = router;
