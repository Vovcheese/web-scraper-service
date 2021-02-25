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
      request: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19'
        }
      },
      recursive: true,
      maxRecursiveDepth: 1,
      maxDepth: 3,
      requestConcurrency: 1,
    };
  }

  setOptions(options: scrape.Options) {
    this.options = { ...this.options, ...options, urlFilter: (url) => url.startsWith(String(options.urls[0]))};
  }

  async download() {
    await scrape(this.options);
  }
}
