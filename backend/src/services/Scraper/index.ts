import scrape from 'website-scraper';
import ScraperServide from './lib/index';
import WebScraperProvider from './lib/providers/WebScraperProvider';
import siteService from '@services/domain/Site/index';
import translationsService from '@services/domain/Translation/index';

export const webScraperService = new ScraperServide<scrape.Options>(
  new WebScraperProvider(),
  siteService,
  translationsService,
);
