import scrape from 'website-scraper';
import ScraperServise from './lib/index';
import WebScraperProvider from './lib/providers/WebScraperProvider';
import fileService from '@services/domain/File/index';
import translationService from '@services/domain/Translation/index';

export const webScraperService = new ScraperServise<scrape.Options>(
  new WebScraperProvider(),
  fileService,
  translationService,
);
