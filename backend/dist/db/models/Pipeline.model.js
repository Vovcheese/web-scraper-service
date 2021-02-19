"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Site_model_1 = __importDefault(require("@models/Site.model"));
const interfaces_1 = require("@db/interfaces");
let PipelineModel = class PipelineModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.ForeignKey(() => Site_model_1.default),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], PipelineModel.prototype, "siteId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.ENUM({ values: Object.values(interfaces_1.ETypePipeline) })),
    __metadata("design:type", String)
], PipelineModel.prototype, "type", void 0);
__decorate([
    sequelize_typescript_1.Default(interfaces_1.EStatus.PENDING),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.ENUM({ values: Object.values(interfaces_1.EStatus) })),
    __metadata("design:type", String)
], PipelineModel.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Default(0),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], PipelineModel.prototype, "time", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], PipelineModel.prototype, "error", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Site_model_1.default, { foreignKey: 'siteId', onDelete: 'CASCADE' }),
    __metadata("design:type", Site_model_1.default)
], PipelineModel.prototype, "site", void 0);
PipelineModel = __decorate([
    sequelize_typescript_1.Scopes(() => ({})),
    sequelize_typescript_1.Table({
        timestamps: true,
        tableName: 'Pipelines',
    })
], PipelineModel);
exports.default = PipelineModel;
