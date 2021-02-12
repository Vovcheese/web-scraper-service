import scrape from 'website-scraper';
import { IScraperProvider } from '../interfaces';

export default class WebScraperProvider implements IScraperProvider {
  private options: any;

  constructor() {}

  setOptions(options: scrape.Options) {
    this.options = options;
  }

  async download() {
    await scrape(this.options);
  }
}
