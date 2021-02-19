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
let FileModel = class FileModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.ForeignKey(() => Site_model_1.default),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], FileModel.prototype, "siteId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING(500)),
    __metadata("design:type", String)
], FileModel.prototype, "fileName", void 0);
__decorate([
    sequelize_typescript_1.Default(0),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], FileModel.prototype, "size", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], FileModel.prototype, "ext", void 0);
__decorate([
    sequelize_typescript_1.Default(false),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], FileModel.prototype, "isFolder", void 0);
__decorate([
    sequelize_typescript_1.Default(0),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], FileModel.prototype, "parent", void 0);
__decorate([
    sequelize_typescript_1.Default(interfaces_1.EStatus.PENDING),
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.ENUM({ values: Object.values(interfaces_1.EStatus) })),
    __metadata("design:type", String)
], FileModel.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], FileModel.prototype, "error", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Site_model_1.default, { foreignKey: 'siteId', onDelete: 'CASCADE' }),
    __metadata("design:type", Site_model_1.default)
], FileModel.prototype, "site", void 0);
FileModel = __decorate([
    sequelize_typescript_1.Scopes(() => ({})),
    sequelize_typescript_1.Table({
        timestamps: true,
        tableName: 'Files',
    })
], FileModel);
exports.default = FileModel;
