import scrape from 'website-scraper';
import path from 'path';
import PipelineModel from '@db/models/Pipeline.model';
import { Repository } from 'sequelize-typescript';
import BaseCRUD from '@services/domain/BaseCRUD';
import { EStatus, ETypePipeline } from '@db/interfaces';
import { ioServer } from '../../../app';
import { repos } from '@db/index';

import { webScraperService } from '@services/scraper/index';
import { IScraperService } from '@services/scraper/lib/index';
import translationService, { ITranslationService } from '@services/domain/Translation/index';
export interface IPipelineService extends BaseCRUD<PipelineModel> {
  createPipeline(siteId: number): Promise<PipelineModel[]>;
  changeStatus(
    siteId: number,
    status: EStatus,
    type: ETypePipeline,
    error?: string,
  ): Promise<[number, PipelineModel[]]>;
  processDownloadStage(siteId: number, link: string): any;
  processFileSearchingStage(siteId: number): any;
  processGenerateTextIdsStage(siteId: number, langList: string[], domain: string): any;
}

export class PiplineService
  extends BaseCRUD<PipelineModel>
  implements IPipelineService {
  constructor(
    private pipelineRepositiory: Repository<PipelineModel>,
    private webScraperService: IScraperService<scrape.Options>,
    private translationService: ITranslationService,
  ) {
    super(pipelineRepositiory);
  }

  async createPipeline(siteId: number) {
    return this.bulkCreate([
      { siteId, type: ETypePipeline.DOWNLOAD },
      { siteId, type: ETypePipeline.FILESEARCHING },
      { siteId, type: ETypePipeline.GENERATEID },
      { siteId, type: ETypePipeline.TRANSLATING },
    ]);
  }

  async changeStatus(
    siteId: number,
    status: EStatus,
    type: ETypePipeline,
    error?: string,
  ) {
    const obj: Partial<PipelineModel> = { status };

    if (error) {
      obj.error = error;
    }
    
    ioServer.emit('UPDATE_STATUS_PIPELINE', { siteId, type, status, error })

    return this.update(obj, { where: { siteId, type } });
  }

  async reloadStatus(findModel: PipelineModel) {
    findModel.status = EStatus.PROGRESS;
    findModel.error = null;
    await findModel.save();
  }

  // Stage 1
  async processDownloadStage(siteId: number, link: string) {
    await this.createPipeline(siteId);

    try {
      const options: scrape.Options = {
        urls: [link],
        directory: path.resolve(process.cwd(), 'views', String(siteId)),
      };
      await this.changeStatus(
        siteId,
        EStatus.PROGRESS,
        ETypePipeline.DOWNLOAD,
      );

      const startTime = Date.now();

      await this.webScraperService.downloadSite(options);

      const endTime = Date.now() - startTime;

      this.update(
        { time: endTime },
        { where: { siteId, type: ETypePipeline.DOWNLOAD } },
      );

      await this.changeStatus(
        siteId,
        EStatus.SUCCESS,
        ETypePipeline.DOWNLOAD,
      );
    } catch (error) {
      await this.changeStatus(
        siteId,
        EStatus.ERROR,
        ETypePipeline.DOWNLOAD,
        error.message
      );
      throw new Error(error);
    }
  }

  // Stage 2
  async processFileSearchingStage(siteId: number) {
    try {
      await this.changeStatus(
        siteId,
        EStatus.PROGRESS,
        ETypePipeline.FILESEARCHING,
      );

      const startTime = Date.now();

      await this.webScraperService.parseSiteFolder(siteId);
        
      const endTime = Date.now() - startTime;
  
      this.update(
        { time: endTime },
        { where: { siteId, type: ETypePipeline.FILESEARCHING } },
      );

      await this.changeStatus(
        siteId,
        EStatus.SUCCESS,
        ETypePipeline.FILESEARCHING,
      );
    } catch (error) {
      await this.changeStatus(
        siteId,
        EStatus.ERROR,
        ETypePipeline.FILESEARCHING,
        error.message,
      );
      throw new Error(error);
    }
  }

  // Stage 3
  async processGenerateTextIdsStage(
    siteId: number,
    langList: string[],
    domain: string,
  ) {
    try {
      await this.changeStatus(
        siteId,
        EStatus.PROGRESS,
        ETypePipeline.GENERATEID,
      );

      const startTime = Date.now();

      await this.webScraperService.generateTextIds(siteId, langList, domain);

      const endTime = Date.now() - startTime;

      this.update(
        { time: endTime },
        { where: { siteId, type: ETypePipeline.GENERATEID } },
      );

      await this.changeStatus(
        siteId,
        EStatus.SUCCESS,
        ETypePipeline.GENERATEID,
      );
    } catch (error) {
      console.log(error);
      await this.changeStatus(
        siteId,
        EStatus.ERROR,
        ETypePipeline.GENERATEID,
        error.message,
      );
      throw new Error(error);
    }
  }

  // Stage 4
  async processTranslationStage(
    siteId: number,
    limit?:number
  ) {
    try {
      await this.changeStatus(
        siteId,
        EStatus.PROGRESS,
        ETypePipeline.TRANSLATING,
      );

      const startTime = Date.now();
      
      await this.translationService.translateTextSite(siteId, limit)

      const endTime = Date.now() - startTime;

      this.update(
        { time: endTime },
        { where: { siteId, type: ETypePipeline.TRANSLATING } },
      );

      await this.changeStatus(
        siteId,
        EStatus.SUCCESS,
        ETypePipeline.TRANSLATING,
      );
    } catch (error) {
      console.log(error);
      await this.changeStatus(
        siteId,
        EStatus.ERROR,
        ETypePipeline.TRANSLATING,
        error.message,
      );
    }
  }
}

export default new PiplineService(
  repos.pipelineRepositiory,
  webScraperService,
  translationService
  );
