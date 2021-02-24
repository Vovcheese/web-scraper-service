import { Context } from 'koa';
import siteService from '@services/domain/Site/index';
import fileService from '@services/domain/File/index';
import translationService from '@services/domain/Translation/index';
import SiteModel from '@db/models/Site.model';
import sequelize from '@db/index';
import PipelineModel from '@db/models/Pipeline.model';

interface IListSite {
  rows: Partial<ISiteListStats>[];
  count: number;
}

interface ISiteListStats extends SiteModel {
  countFiles: number;
  countWords: number;
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

  const pipelineRepository = sequelize.getRepository(PipelineModel)

  const list = (await siteService.list(
    {
      include: [pipelineRepository],
      where: { domain },
    },
    page,
    limit,
  )) as IListSite;

  const countFiles = ((await fileService.count({
    attributes: ['siteId'],
    where: {
      ext: '.html',
    },
    group: 'siteId',
  })) as unknown) as ICountSite[];

  const countTexts = ((await translationService.count({
    attributes: ['siteId'],
    group: 'siteId',
  })) as unknown) as ICountSite[];

  const mapCountFiles: ICountMap = countFiles.reduce((acc, result) => {
    if (!acc[result.siteId]) acc[result.siteId] = result.count;

    return acc;
  }, {} as ICountMap);

  const mapCountTexts: ICountMap = countTexts.reduce((acc, result) => {
    if (!acc[result.siteId]) acc[result.siteId] = result.count;

    return acc;
  }, {} as ICountMap);

  list.rows = list.rows.map((site) => {
    const siteJson: Partial<ISiteListStats> = site.toJSON();
    siteJson.countFiles = mapCountFiles[site.id] || 0;
    siteJson.countWords = mapCountTexts[site.id] || 0;

    return siteJson;
  });

  ctx.body = { ...list, page, limit };
};
