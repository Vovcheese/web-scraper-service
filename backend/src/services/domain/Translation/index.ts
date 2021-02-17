import TranslationModel from '@models/Translation.model';
import { Repository } from 'sequelize-typescript';
import repos from '@models/index';
import BaseCRUD from '@services/domain/BaseCRUD';


export interface ITranslationService extends BaseCRUD<TranslationModel> {}
export class TranslationService extends BaseCRUD<TranslationModel> {
  constructor(
    private translationRepositiory: Repository<TranslationModel>,
  ) {
    super(translationRepositiory);
  }
}

export default new TranslationService(
  repos.translationRepository,
);
