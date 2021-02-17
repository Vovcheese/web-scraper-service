import { Repository } from 'sequelize-typescript';
import {
  BulkCreateOptions,
  CountOptions,
  CreateOptions,
  DestroyOptions,
  FindAndCountOptions,
  FindOptions,
  FindOrCreateOptions,
  Model,
  UpdateOptions,
} from 'sequelize/types';

export default class BaseCRUD<T extends Model> {
  constructor(
    private repository: Repository<T>,
  ) {}

  async create(modelObject: Partial<T>, createOptions?: CreateOptions) {
    return this.repository.create(modelObject, createOptions);
  }

  async bulkCreate(modelObjects: Partial<T>[], createOptions?: BulkCreateOptions) {
    return this.repository.bulkCreate(modelObjects, createOptions);
  }

  async findOrCreate(createOptions: FindOrCreateOptions) {
    return this.repository.findOrCreate(createOptions);
  }

  async findOne(object: FindOptions) {
    return this.repository.findOne(object);
  }

  async findAll(object: FindOptions) {
    return this.repository.findAll(object);
  }

  async update(modelObject: Partial<T>, updateObject: UpdateOptions) {
    return this.repository.update(modelObject, updateObject);
  }

  async delete(object: DestroyOptions) {
    return this.repository.destroy(object);
  }

  async getById(id: number) {
    return this.repository.findByPk(id);
  }

  async list(findOptions: FindAndCountOptions, page: number, limit: number) {
    const offset = (page - 1) * limit;

    return this.repository.findAndCountAll({ ...findOptions, limit, offset });
  }

  async count(findOptions: CountOptions) {

    return this.repository.count(findOptions);
  }
}
