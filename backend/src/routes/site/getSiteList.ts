import { Context } from 'koa';
import { 
  siteServiceFactory,
  fileServiceFactory,
  translationServiceFactory
} from '@services/index';
import SiteModel from '@db/models/Site.model';
import { repos } from '@db/index';
import { EStatus } from '@/db/interfaces';

interface IListSite {
  rows: Partial<ISiteListStats>[];
  count: number;
}

interface ISiteListStats extends SiteModel {
  countFiles: number;
  countWords: number;
  countTranslatedWords: number;
  countDefaultWords: number;
}

interface ICountSite {
  siteId: number;
  count: number;
}

interface ICountMap {
  [key: string]: number;
}

export default async (ctx: Context) => {
  const domain = ctx.header.host;
  const page = Number(ctx.query.page) || 1;
  const limit = Number(ctx.query.pageSize) || 50;

  const list = (await siteServiceFactory().list(
    {
      include: [repos.pipelineRepositiory],
      where: { domain },
    },
    page,
    limit,
  )) as IListSite;

  const countFiles = ((await fileServiceFactory().count({
    attributes: ['siteId'],
    where: {
      ext: '.html',
    },
    group: 'siteId',
  })) as unknown) as ICountSite[];

  const countAllTexts = ((await translationServiceFactory().count({
    attributes: ['siteId'],
    group: 'siteId',
  })) as unknown) as ICountSite[];

  const countDefaultTexts = ((await translationServiceFactory().count({
    attributes: ['siteId'],
    where: { default: true },
    group: 'siteId',
  })) as unknown) as ICountSite[];

  const countTranslatedTexts = ((await translationServiceFactory().count({
    attributes: ['siteId'],
    where: {
      status: EStatus.SUCCESS 
    },
    group: 'siteId',
  })) as unknown) as ICountSite[];

  const mapCountFiles: ICountMap = countFiles.reduce((acc, result) => {
    if (!acc[result.siteId]) acc[result.siteId] = result.count;

    return acc;
  }, {} as ICountMap);

  const mapCountAllTexts: ICountMap = countAllTexts.reduce((acc, result) => {
    if (!acc[result.siteId]) acc[result.siteId] = result.count;

    return acc;
  }, {} as ICountMap);

  const mapCountTranslatedTexts: ICountMap = countTranslatedTexts.reduce((acc, result) => {
    if (!acc[result.siteId]) acc[result.siteId] = result.count;

    return acc;
  }, {} as ICountMap);

  const mapCountDefaultTexts: ICountMap = countDefaultTexts.reduce((acc, result) => {
    if (!acc[result.siteId]) acc[result.siteId] = result.count;

    return acc;
  }, {} as ICountMap);

  list.rows = list.rows.map((site) => {
    const siteJson: Partial<ISiteListStats> = site.toJSON();
    siteJson.countFiles = mapCountFiles[site.id] || 0;
    siteJson.countWords = mapCountAllTexts[site.id] || 0;
    siteJson.countDefaultWords = mapCountDefaultTexts[site.id] || 0;
    siteJson.countTranslatedWords = mapCountTranslatedTexts[site.id] || 0;

    return siteJson;
  });

  ctx.body = { ...list, page, limit };
};
