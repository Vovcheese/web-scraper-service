import { Repository } from 'sequelize-typescript';
import repos from '@models/index';
import BaseCRUD from '@services/domain/BaseCRUD';
import UserModel from '@models/User.model';


export interface IUserService extends BaseCRUD<UserModel> {}

export class TranslationService extends BaseCRUD<UserModel> {
  constructor(
    private userRepositiory: Repository<UserModel>,
  ) {
    super(userRepositiory);
  }
}

export default new TranslationService(
  repos.userRepository,
);
