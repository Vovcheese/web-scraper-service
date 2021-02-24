import { Repository } from 'sequelize-typescript';
import BaseCRUD from '@services/domain/BaseCRUD';
import UserModel from '@db/models/User.model';
import { repos } from '@db/index';

export interface IUserService extends BaseCRUD<UserModel> {}

export class UserService extends BaseCRUD<UserModel> {
  constructor(
    private userRepositiory: Repository<UserModel>,
  ) {
    super(userRepositiory);
  }
}

export default new UserService(
  repos.userRepositiory,
);
