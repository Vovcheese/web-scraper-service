import path from 'path';
import Router from '@koa/router';
import scrape from 'website-scraper';
import uuid from 'uuid';
import { promises as fs } from 'fs';
import cheerio from 'cheerio';
import { Context } from 'koa';
import { webScraperService } from '@services/Scraper/index';
import siteService from '@services/domain/Site/index';

const router = new Router();

router.prefix('/scrape');

const langList = ['it', 'en', 'ru'];

interface IScrapeBody {
  siteName: string;
  mainLink: string;
}

router.post('/', async (ctx: Context) => {
  const body: IScrapeBody = ctx.request.body;

  if(!body.siteName) {
    body.siteName = 'Test';
  }

  const findSite = await siteService.findOne({
    where: { name: body.siteName },
  });

  if (findSite) {
    throw new Error('A site with the same name already exists');
  }

  await siteService.create({ name: body.siteName, url: body.mainLink });

  // const options: scrape.Options = {
  //   urls: [body.mainLink],
  //   directory: path.resolve('@', 'views', body.siteName),
  //   sources: [
  //     { selector: 'img', attr: 'src' },
  //     { selector: 'link[rel="stylesheet"]', attr: 'href' },
  //     { selector: 'script', attr: 'src' },
  //   ],
  //   recursive: true,
  //   maxRecursiveDepth: 1,
  //   maxDepth: 3,
  //   requestConcurrency: 1,
  // };

  // const result = await webScraperService.downloadSite(options);

  // const site = new SiteModel();

  // site.name = body.siteName;
  // site.url = body.mainLink;

  // await site.save();

  // try {
  //   await parse(path.resolve('@', 'views', site.name, 'index.html'), site.id);
  //   site.status = 'SUCCESS';
  //   await site.save();
  // } catch (error) {
  //   site.status = 'ERROR';
  //   site.error = error.message;
  //   await site.save();
  // }

  ctx.body = { success: true };
});

// const parse = async (path: string, siteId: number) => {
//   console.log('Start parsing', siteId);

//   const loadFile = await fs.readFile(path, 'utf-8');

//   const $ = cheerio.load(loadFile);

//   const childrens = $('body').children();

//   const result = await searchTextNode($, childrens, siteId);

//   await fs.writeFile(path, result.html(), 'utf-8');
// };

// const searchTextNode = async ($: any, childrens: any, siteId: number) => {
//   for (const child of childrens) {
//     if (child.type === 'tag') {
//       if (child.children) {
//         await searchTextNode($, child.children, siteId);
//       }
//     } else if (child.type === 'text') {
//       if (child.data.trim().length > 1) {
//         const id = randomId();
//         const text = child.data;
//         if (text.indexOf('{{') === -1 && text.indexOf('}}') === -1) {
//           const wrap = $(child).wrap('<span></span>');
//           const parent = $(wrap.parent());
//           const promises = [];
//           const translation = new TranslationsModel();
//           translation.siteId = siteId;
//           translation.textId = id;
//           translation.text = text;
//           translation.default = true;
//           promises.push(translation.save());

//           for (const lang of langList) {
//             const translation = new TranslationsModel();
//             translation.siteId = siteId;
//             translation.lang = lang;
//             translation.textId = id;
//             translation.text = text;
//             translation.default = false;
//             promises.push(translation.save());
//           }

//           await Promise.all(promises);

//           parent.text(`{{${id}}}`);
//         }
//       }
//     }
//   }
//   return $;
// };

// const randomId = () => {
//   return uuid.v4();
// };

export default router;
