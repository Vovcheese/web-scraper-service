"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BaseCRUD {
    constructor(repository) {
        this.repository = repository;
    }
    create(modelObject, createOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.create(modelObject, createOptions);
        });
    }
    bulkCreate(modelObjects, createOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.bulkCreate(modelObjects, createOptions);
        });
    }
    findOrCreate(createOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findOrCreate(createOptions);
        });
    }
    findOne(object) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findOne(object);
        });
    }
    findAll(object) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findAll(object);
        });
    }
    update(modelObject, updateObject) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.update(modelObject, updateObject);
        });
    }
    delete(object) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.destroy(object);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.findByPk(id);
        });
    }
    list(findOptions, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * limit;
            return this.repository.findAndCountAll(Object.assign(Object.assign({}, findOptions), { limit, offset }));
        });
    }
    count(findOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.count(findOptions);
        });
    }
}
exports.default = BaseCRUD;
