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
const Translation_model_1 = __importDefault(require("@models/Translation.model"));
const Pipeline_model_1 = __importDefault(require("@models/Pipeline.model"));
const File_model_1 = __importDefault(require("@models/File.model"));
let SiteModel = class SiteModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Unique,
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], SiteModel.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], SiteModel.prototype, "url", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], SiteModel.prototype, "domain", void 0);
__decorate([
    sequelize_typescript_1.Default(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], SiteModel.prototype, "active", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Translation_model_1.default, { foreignKey: 'siteId', onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], SiteModel.prototype, "translations", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Pipeline_model_1.default, { foreignKey: 'siteId', onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], SiteModel.prototype, "pipelines", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => File_model_1.default, { foreignKey: 'siteId', onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], SiteModel.prototype, "files", void 0);
SiteModel = __decorate([
    sequelize_typescript_1.Scopes(() => ({})),
    sequelize_typescript_1.Table({
        timestamps: true,
        tableName: 'Sites',
    })
], SiteModel);
exports.default = SiteModel;
