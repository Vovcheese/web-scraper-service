import TranslationModel from '@db/models/Translation.model';
import { Repository } from 'sequelize-typescript';
import BaseCRUD from '@services/domain/BaseCRUD';
import { repos, op } from '@db/index';
import { ITranslaterService, translaterService } from '@services/translater/index';
import { EStatus } from '@db/interfaces';
import { ioServer } from '@/app';




export interface ITranslationService extends BaseCRUD<TranslationModel> {
  translateTextSite(siteId: number): Promise<void>
}
export class TranslationService extends BaseCRUD<TranslationModel> {
  constructor(
    private translationRepositiory: Repository<TranslationModel>,
    private translaterService: ITranslaterService
  ) {
    super(translationRepositiory);
  }

  async translateTextSite(siteId: number) {
    let lastId = 0;
    let findTranslations: TranslationModel[] = []

    do {
      findTranslations = await this.findAll({ where: { siteId, id: { [op.gt]: lastId }, status: { [op.ne]: EStatus.SUCCESS } }, order: ['id', 'ASC'], limit: 1000 });
      let countTranslate = 0
      for (const translation of findTranslations) {
        try {
          translation.status = EStatus.PROGRESS
          await translation.save()
          lastId = translation.id;
          const translationData = await this.translaterService.translate(translation.text, translation.lang);
          translation.text = translationData.outputText;
          translation.status = EStatus.SUCCESS;
          await translation.save();
          countTranslate += 1;
          ioServer.emit('UPDATE_COUNT_TRANSLATES', { count: countTranslate })
        } catch (error) {
          translation.status = EStatus.ERROR
          translation.error = error.message
          await translation.save()
        }
      }

    } while (findTranslations && findTranslations.length !== 0);
  }
}

export default new TranslationService(
  repos.translationRepositiory,
  translaterService
);
