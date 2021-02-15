import path from 'path';
import SiteModel from '@models/Site.model';
import { Repository } from 'sequelize-typescript';
import repos from '@models/index';
import BaseCRUD from '../BaseCRUD';
import scrape from 'website-scraper';
import { webScraperService } from '@services/Scraper/index';
import { IScraperService } from '@services/Scraper/lib/index';
import pipelineService, {
  IPipelineService,
} from '@services/domain/Pipline/index';
import { EStatus, ETypePipeline } from '@db/interfaces';

export class SiteService extends BaseCRUD<SiteModel> {
  constructor(
    private siteRepositiory: Repository<SiteModel>,
    private webScraperService: IScraperService<scrape.Options>,
    private pipelineService: IPipelineService
  ) {
    super(siteRepositiory);
  }
  // Stage 1
  async processDownloadStage(siteName: string, link: string) {
    const site = await this.create({
      name: siteName,
      url: link,
    });

    await this.pipelineService.createPipeline(site.id);

    const siteId: number = site.id;

    try {
      const options: scrape.Options = {
        urls: [link],
        directory: path.resolve(process.cwd(), 'views', String(site.id)),
      };
      await this.pipelineService.changeStatus(
        siteId,
        EStatus.PROGRESS,
        ETypePipeline.DOWNLOAD
      );

      await this.webScraperService.downloadSite(options);

      await this.pipelineService.changeStatus(
        siteId,
        EStatus.SUCCESS,
        ETypePipeline.DOWNLOAD
      );
    } catch (error) {
      console.log(error);
      await this.pipelineService.changeStatus(
        siteId,
        EStatus.ERROR,
        ETypePipeline.DOWNLOAD,
        error.message
      );
      throw new Error(error);
    }

    return site;
  }

  // Stage 2
  async processFileSearchingStage(siteId: number) {
    try {
      await this.update(
        { stage: ETypePipeline.FILESEARCHING },
        { where: { id: siteId } },
      );
      await this.pipelineService.changeStatus(
        siteId,
        EStatus.PROGRESS,
        ETypePipeline.FILESEARCHING,
      );

      await this.webScraperService.parseSiteFolder(siteId);

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
  async processGenerateTextIdsStage(siteId: number, langList: string[]) {
    try {
      await this.update(
        { stage: ETypePipeline.GENERATEID },
        { where: { id: siteId } },
      );
      await this.pipelineService.changeStatus(
        siteId,
        EStatus.PROGRESS,
        ETypePipeline.GENERATEID,
      );

      await this.webScraperService.generateTextIds(siteId, langList);

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
}

export default new SiteService(
  repos.siteRepository,
  webScraperService,
  pipelineService,
);
