import { SiteService } from '@services/domain/Site';
import { TranslationService } from '@services/domain/Translation';
import { IScraperProvider } from './providers/interfaces';

export default class ScraperServie<T> {
  constructor(
    private scraperProvider: IScraperProvider,
    private siteService: SiteService,
    private translateService: TranslationService,
  ) {}

  async downloadSite(options: T) {
    this.scraperProvider.setOptions(options);
    await this.scraperProvider.download();
  }

  async parseSiteFolder(siteId: number) {}

  async findTextInHtml() {}
}
