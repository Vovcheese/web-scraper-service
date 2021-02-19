"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("@db/index"));
const Site_model_1 = __importDefault(require("@models/Site.model"));
const File_model_1 = __importDefault(require("@models/File.model"));
const Translation_model_1 = __importDefault(require("@models/Translation.model"));
const Pipeline_model_1 = __importDefault(require("@models/Pipeline.model"));
const User_model_1 = __importDefault(require("@models/User.model"));
const Migration_model_1 = __importDefault(require("@models/Migration.model"));
const getRepositories = (sequelize) => {
    return {
        siteRepository: sequelize.getRepository(Site_model_1.default),
        translationRepository: sequelize.getRepository(Translation_model_1.default),
        pipelineRepository: sequelize.getRepository(Pipeline_model_1.default),
        fileRepository: sequelize.getRepository(File_model_1.default),
        userRepository: sequelize.getRepository(User_model_1.default),
        migrationRepository: sequelize.getRepository(Migration_model_1.default),
    };
};
exports.default = getRepositories(index_1.default);
