import scrape from 'website-scraper';
import ScraperService from './lib/index';
import WebScraperProvider from './lib/providers/WebScraperProvider';
import fileService from '@services/domain/File/index';
import translationService from '@services/domain/Translation/index';

export const webScraperService = new ScraperService<scrape.Options>(
  new WebScraperProvider(),
  fileService,
  translationService,
);
