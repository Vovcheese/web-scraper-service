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
const File_model_1 = __importDefault(require("@models/File.model"));
const interfaces_1 = require("@db/interfaces");
let TranslationModel = class TranslationModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.ForeignKey(() => Site_model_1.default),
    sequelize_typescript_1.Unique('siteId_textId_lang'),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], TranslationModel.prototype, "siteId", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => File_model_1.default),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], TranslationModel.prototype, "fileId", void 0);
__decorate([
    sequelize_typescript_1.Unique('siteId_textId_lang'),
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], TranslationModel.prototype, "textId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], TranslationModel.prototype, "text", void 0);
__decorate([
    sequelize_typescript_1.Unique('siteId_textId_lang'),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], TranslationModel.prototype, "lang", void 0);
__decorate([
    sequelize_typescript_1.Default(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], TranslationModel.prototype, "default", void 0);
__decorate([
    sequelize_typescript_1.Default(interfaces_1.EStatus.PENDING),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.ENUM({ values: Object.values(interfaces_1.EStatus) })),
    __metadata("design:type", String)
], TranslationModel.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], TranslationModel.prototype, "error", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Site_model_1.default, { foreignKey: 'siteId', onDelete: 'CASCADE' }),
    __metadata("design:type", Site_model_1.default)
], TranslationModel.prototype, "site", void 0);
TranslationModel = __decorate([
    sequelize_typescript_1.Scopes(() => ({})),
    sequelize_typescript_1.Table({
        timestamps: true,
        tableName: 'Translations',
    })
], TranslationModel);
exports.default = TranslationModel;
