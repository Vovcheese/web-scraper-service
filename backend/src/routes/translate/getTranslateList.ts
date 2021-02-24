import { Context } from 'koa';
import translationService from '@services/domain/Translation/index';
import sequelize, { op } from '@db/index';
import FileModel from '@db/models/File.model';
import SiteModel from '@db/models/Site.model';

interface IWhereObj {
  siteId: number;
  lang?: string;
  default?: boolean;
  text?: { [op.like]: string; };
}

export default async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId);
  const lang: string = ctx.query.language || 'all';
  const isDefault: boolean = ctx.query.default === 'true';
  const query: boolean = ctx.query.query;
  const page = Number(ctx.query.page) || 1;
  const limit = Number(ctx.query.pageSize) || 50;

  const fileRepository = sequelize.getRepository(FileModel)
  const siteRepository = sequelize.getRepository(SiteModel)

  const whereObj: IWhereObj = { siteId };

  if (lang !== 'all') {
    whereObj.lang = lang;
  }

  if (query) {
    whereObj.text = {[op.like]: `%${query}%`};
  }

  if (isDefault) {
    delete whereObj.lang;
    whereObj.default = isDefault;
  }

  const list = await translationService.list(
    {
      include:[fileRepository, siteRepository],
      where: { ...whereObj },
    },
    page,
    limit,
  );

  ctx.body = { ...list, page, limit };
};
