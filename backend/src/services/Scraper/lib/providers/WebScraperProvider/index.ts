import scrape from 'website-scraper';
import { IScraperProvider } from '../interfaces';

export default class WebScraperProvider implements IScraperProvider<scrape.Options> {
  private options: scrape.Options;

  constructor() {
    this.options = {
      urls: [],
      directory: '',
      sources: [
        { selector: 'img', attr: 'src' },
        { selector: 'link[rel="stylesheet"]', attr: 'href' },
        { selector: 'script', attr: 'src' },
      ],
      recursive: true,
      maxRecursiveDepth: 1,
      maxDepth: 3,
      requestConcurrency: 1,
    };
  }

  setOptions(options: scrape.Options) {
    this.options = { ...this.options, ...options };
  }

  async download() {
    await scrape(this.options);
  }
}
