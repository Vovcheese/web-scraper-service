import { promises as fs } from 'fs';
import path from 'path';
import { repos } from '@db/index';
import SiteModel from '@db/models/Site.model';
import { Repository } from 'sequelize-typescript';
import BaseCRUD from '@services/domain/BaseCRUD';
import scrape from 'website-scraper';
import { webScraperService } from '@services/scraper/index';
import { IScraperService } from '@services/scraper/lib/index';
import pipelineService, {
  IPipelineService,
} from '@services/domain/Pipline/index';
import { EStatus, ETypePipeline } from '@db/interfaces';
import translationService, { ITranslationService } from '@services/domain/Translation/index';

export interface ISiteService extends BaseCRUD<SiteModel>{
  processDownloadStage(siteId: number, link: string): any;
  processFileSearchingStage(siteId: number): any;
  processGenerateTextIdsStage(siteId: number, langList: string[], domain: string): any;
  removeSiteFolder(siteId: number): any;
}

export class SiteService extends BaseCRUD<SiteModel> implements ISiteService{
  constructor(
    private siteRepositiory: Repository<SiteModel>,
    private webScraperService: IScraperService<scrape.Options>,
    private pipelineService: IPipelineService,
    private translationService: ITranslationService,
  ) {
    super(siteRepositiory);
  }
  // Stage 1
  async processDownloadStage(siteId: number, link: string) {
    await this.pipelineService.createPipeline(siteId);

    try {
      const options: scrape.Options = {
        urls: [link],
        directory: path.resolve(process.cwd(), 'views', String(siteId)),
      };
      await this.pipelineService.changeStatus(
        siteId,
        EStatus.PROGRESS,
        ETypePipeline.DOWNLOAD,
      );

      const startTime = Date.now();

      await this.webScraperService.downloadSite(options);

      const endTime = Date.now() - startTime;

      this.pipelineService.update(
        { time: endTime },
        { where: { siteId, type: ETypePipeline.DOWNLOAD } },
      );

      await this.pipelineService.changeStatus(
        siteId,
        EStatus.SUCCESS,
        ETypePipeline.DOWNLOAD,
      );
    } catch (error) {
      await this.pipelineService.changeStatus(
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
      await this.pipelineService.changeStatus(
        siteId,
        EStatus.PROGRESS,
        ETypePipeline.FILESEARCHING,
      );

      const startTime = Date.now();

      await this.webScraperService.parseSiteFolder(siteId);
        
      const endTime = Date.now() - startTime;
  
      this.pipelineService.update(
        { time: endTime },
        { where: { siteId, type: ETypePipeline.FILESEARCHING } },
      );

      await this.pipelineService.changeStatus(
        siteId,
        EStatus.SUCCESS,
        ETypePipeline.FILESEARCHING,
      );
    } catch (error) {
      await this.pipelineService.changeStatus(
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
      await this.pipelineService.changeStatus(
        siteId,
        EStatus.PROGRESS,
        ETypePipeline.GENERATEID,
      );

      const startTime = Date.now();

      await this.webScraperService.generateTextIds(siteId, langList, domain);

      const endTime = Date.now() - startTime;

      this.pipelineService.update(
        { time: endTime },
        { where: { siteId, type: ETypePipeline.GENERATEID } },
      );

      await this.pipelineService.changeStatus(
        siteId,
        EStatus.SUCCESS,
        ETypePipeline.GENERATEID,
      );
    } catch (error) {
      console.log(error);
      await this.pipelineService.changeStatus(
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
    siteId: number
  ) {
    try {
      await this.pipelineService.changeStatus(
        siteId,
        EStatus.PROGRESS,
        ETypePipeline.TRANSLATING,
      );

      const startTime = Date.now();

      await this.translationService.translateTextSite(siteId)

      const endTime = Date.now() - startTime;

      this.pipelineService.update(
        { time: endTime },
        { where: { siteId, type: ETypePipeline.TRANSLATING } },
      );

      await this.pipelineService.changeStatus(
        siteId,
        EStatus.SUCCESS,
        ETypePipeline.TRANSLATING,
      );
    } catch (error) {
      console.log(error);
      await this.pipelineService.changeStatus(
        siteId,
        EStatus.ERROR,
        ETypePipeline.TRANSLATING,
        error.message,
      );
    }
  }

  async removeSiteFolder(siteId: number) {
    const pathFolder = path.join(process.cwd(), 'views', String(siteId));
    try {
      await fs.stat(pathFolder);
      await fs.rmdir(pathFolder, { recursive: true });
    } catch (e) {}
  }
}

export default new SiteService(
  repos.siteRepositiory,
  webScraperService,
  pipelineService,
  translationService
);
