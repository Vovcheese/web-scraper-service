"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EStatus = exports.ETypePipeline = void 0;
var ETypePipeline;
(function (ETypePipeline) {
    ETypePipeline["DOWNLOAD"] = "DOWNLOAD";
    ETypePipeline["FILESEARCHING"] = "FILESEARCHING";
    ETypePipeline["GENERATEID"] = "GENERATEID";
    ETypePipeline["TRANSLATING"] = "TRANSLATING";
})(ETypePipeline = exports.ETypePipeline || (exports.ETypePipeline = {}));
var EStatus;
(function (EStatus) {
    EStatus["PENDING"] = "PENDING";
    EStatus["PROGRESS"] = "PROGRESS";
    EStatus["SUCCESS"] = "SUCCESS";
    EStatus["ERROR"] = "ERROR";
})(EStatus = exports.EStatus || (exports.EStatus = {}));
