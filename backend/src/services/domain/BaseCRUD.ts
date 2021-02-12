import { Repository } from 'sequelize-typescript';
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Model,
  UpdateOptions,
} from 'sequelize/types';

export default class BaseCRUD<T extends Model> {
  constructor(
    private repository: Repository<T>,
    public readonly modelClass: new (obj: Partial<T>) => T,
  ) {}

  async create(modelObject: Partial<T>, createOptions?: CreateOptions) {
    const modelInstance = new this.modelClass(modelObject);

    console.log('modelInstance', modelInstance)

    return this.repository.create(modelInstance, createOptions);
  }

  async findOne(object: FindOptions) {
    return this.repository.findOne(object);
  }

  async findAll(object: FindOptions) {
    return this.repository.findAll(object);
  }

  async update(whereObject: FindOptions, updateObject: UpdateOptions) {
    return this.repository.update(whereObject, updateObject);
  }

  async delete(object: DestroyOptions) {
    return this.repository.destroy(object);
  }

  async getById(id: number) {
    return this.repository.findByPk(id);
  }

  async list(limit: number, page: number) {
    const offset = (page - 1) * limit;

    return this.repository.findAndCountAll({ limit, offset });
  }
}

interface IConstructor<T> {
  new (...args: any[]): T;
}

function createInstance<T>(c: { new (obj: T): T }, obj: T): T {
  return new c(obj);
}
