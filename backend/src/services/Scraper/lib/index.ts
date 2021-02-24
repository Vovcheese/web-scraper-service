import uuid from 'uuid';
import cheerio from 'cheerio';
import { promises as fs } from 'fs';
import path from 'path';

import { IFileService } from '@services/domain/File/index';
import { IScraperProvider } from './providers/interfaces';
import { ITranslationService } from '@services/domain/Translation/index';
import { EStatus } from '@db/interfaces';
import { ioServer } from '@/app';

interface ISocketData {
  count: number;
}

export interface IScraperService<T> {
  downloadSite(options: T): Promise<void>;
  parseSiteFolder(siteId: number): Promise<void>;
  generateTextIds(siteId: number, langList: string[], url: string): Promise<void>;
}

export default class ScraperService<T> implements IScraperService<T> {
  constructor(
    private scraperProvider: IScraperProvider<T>,
    private fileService: IFileService,
    private translationService: ITranslationService,
  ) {}

  async downloadSite(options: T) {
    this.scraperProvider.setOptions(options);
    await this.scraperProvider.download();
  }

  async parseSiteFolder(siteId: number) {
    const pathFolder = path.join(process.cwd(), 'views', String(siteId));
    await fs.stat(pathFolder);
    const files = await fs.readdir(pathFolder);
    let countFiles = 0;
    for (const file of files) {
      const pathFile = path.join(pathFolder, file);
      const stats = await fs.lstat(pathFile);
      const isFolder = stats.isDirectory();
      const ext = path.extname(pathFile);
      const fileName = path.basename(pathFile);
      const size = stats.size;

      const findFile = await this.fileService.findOne({
        where: {
          isFolder,
          ext,
          fileName,
          size,
          siteId,
        },
      });

      if (!findFile) {
        await this.fileService.create({
          isFolder,
          ext,
          fileName,
          size,
          siteId,
        });

        if (ext === '.html') {
          countFiles += 1;
          ioServer.emit('UPDATE_COUNT_FILES', { siteId ,count: countFiles })
        }
      }
    }
  }

  async generateTextIds(siteId: number, langList: string[], url: string) {
    const findFiles = await this.fileService.findAll({
      where: { siteId, ext: '.html', isFolder: false },
    });

    const socketData =  { count: 0 }

    for (const file of findFiles) {
      try {
        file.status = EStatus.PROGRESS;
        file.error = null;
        await file.save();
        const folder = path.join(process.cwd(), 'views', String(siteId));
        const pathFile = path.join(folder, file.fileName);

        const loadFile = await fs.readFile(pathFile, 'utf-8');

        const $ = cheerio.load(loadFile);

        const childrens = $('body').children();

        const domain = url.split('/').slice(0, 3).join('/');

        

        const result = await this.searchTextNodeFile(
          $,
          childrens,
          siteId,
          domain,
          file.id,
          langList,
          socketData
        );

        await fs.writeFile(pathFile, result.html(), 'utf-8');

        file.status = EStatus.SUCCESS;
        await file.save();

      } catch (error) {
        file.status = EStatus.ERROR;
        file.error = error.message;
        await file.save();
        throw new Error(error);
      }
    }
  }

  async searchTextNodeFile(
    $: cheerio.Root,
    childrens: cheerio.Cheerio | cheerio.Element[],
    siteId: number,
    domain:string,
    fileId:number,
    langList: string[],
    socketData: ISocketData
  ) {
    for (const [_, child] of Object.entries(childrens)) {
      if (child.type === 'tag') {
        if (child.name === 'a') {
          if (child.attribs && child.attribs.href && child.attribs.href.startsWith(domain)) {
            child.attribs.href = child.attribs.href.split(domain)[1];
            if (!child.attribs.href.endsWith('.html')) {
              const startSlice = child.attribs.href[0] === '/' ? 1 : 0;
              child.attribs.href = `${child.attribs.href.slice(startSlice, -1)}.html`;
              const split = child.attribs.href.split('/');
              child.attribs.href = split[split.length - 1]
            }
          }
        }
        if (child.children) {
          await this.searchTextNodeFile($, child.children, siteId, domain, fileId, langList, socketData);
        }
      } else if (child.type === 'text') {
        if (child.data.trim().length > 1) {
          const id = uuid.v4();
          const text = child.data;
          if (text.indexOf('{{') === -1 && text.indexOf('}}') === -1) {
            const wrap = $(child).wrap('<span></span>');
            const parent = $(wrap.parent());
            const promises = [];
            promises.push(
              this.translationService.create({
                siteId,
                fileId,
                text,
                textId: id,
                default: true,
              }),
            );

            socketData.count += 1;
            
            for (const lang of langList) {
              promises.push(this.translationService.create({
                siteId,
                fileId,
                text,
                lang,
                textId: id,
                default: false,
              }));
              socketData.count += 1;
              if(socketData.count % 1000 === 0) {
                ioServer.emit('UPDATE_COUNT_TRANSLATES', { siteId, ...socketData })
              }
            }

            await Promise.all(promises);

            parent.text(`{{${id}}}`);
          }
        }
      }
    }
    return $;
  }
}
