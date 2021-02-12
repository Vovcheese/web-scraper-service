import TranslationModel from '@models/Translation.model';
import { Repository } from 'sequelize-typescript';
import repos from '@models/index';
import BaseCRUD from '../BaseCRUD';

export class TranslationService extends BaseCRUD<TranslationModel> {
  constructor(
    private translationRepositiory: Repository<TranslationModel>,
    model: new () => TranslationModel,
  ) {
    super(translationRepositiory, model);
  }
}

export default new TranslationService(
  repos.translationRepository,
  TranslationModel,
);
