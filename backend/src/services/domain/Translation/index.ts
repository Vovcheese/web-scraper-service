import TranslationModel from '@db/models/Translation.model';
import { Repository } from 'sequelize-typescript';
import BaseCRUD from '@services/domain/BaseCRUD';
import { repos, op, seq } from '@db/index';
import { ITranslaterService, deeplService } from '@services/translater/index';
import { EStatus } from '@db/interfaces';
import { ioServer } from '@/app';




export interface ITranslationService extends BaseCRUD<TranslationModel> {
  translateTextSite(siteId: number, limit?: number): Promise<void>;
  getLangList(siteId: number): Promise<string[]>
}
export class TranslationService extends BaseCRUD<TranslationModel> implements ITranslationService{
  constructor(
    private translationRepositiory: Repository<TranslationModel>,
    private translaterService: ITranslaterService
  ) {
    super(translationRepositiory);
  }

  async translateTextSite(siteId: number, limit?: number) {
    let lastId = 0;
    let findTranslations: TranslationModel[] = []

    let countTranslate = await this.count({where: { siteId, default: true}});

    do {
      findTranslations = await this.findAll({ 
        where: {
          siteId,
          default: false, 
          id: { [op.gt]: lastId }, 
          status: { [op.ne]: EStatus.SUCCESS } 
        }, 
        order: [['id', 'ASC']], 
        limit: limit || 500 
      });

      
      const promises = [];
      for (const translation of findTranslations) {
        try {
          translation.status = EStatus.PROGRESS;
          translation.error = null;
          await translation.save()
          lastId = translation.id;

          promises.push(this.translaterService.translate(translation));

        } catch (error) {
          translation.status = EStatus.ERROR;
          translation.error = error.message;
          await translation.save();
        }
      }

      

      try {
        const results = await Promise.all(promises);
        for (const result of results) {
          result.translation.text = result.outputText;
          result.translation.status = EStatus.SUCCESS;
          await result.translation.save()
        }
        countTranslate += results.length || 0;
        ioServer.emit('UPDATE_COUNT_TRANSLATES', { siteId, count: countTranslate });
      } catch (error) {
        console.log(error)
      }
      

    } while (!limit && findTranslations && findTranslations.length !== 0);
  }

  async getLangList(siteId: number) {
    const findLangs = await this.findAll({ attributes:[
      [seq.fn('DISTINCT', seq.col('lang')) ,'lang']
    ] , where: { siteId, default: false } })
    return findLangs.map(i => i.lang);
  }
}



export default new TranslationService(
  repos.translationRepositiory,
  deeplService
);
