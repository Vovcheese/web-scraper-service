import scrape from 'website-scraper';
import ScraperService from '@services/scraper/lib/index';
import WebScraperProvider from '@services/scraper/lib/providers/WebScraperProvider';
import fileService from '@services/domain/File/index';
import translationService from '@services/domain/Translation/index';

export const webScraperService = new ScraperService<scrape.Options>(
  new WebScraperProvider(),
  fileService,
  translationService,
);
