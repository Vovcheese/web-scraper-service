import { Context } from 'koa';
import translationService from '@services/domain/Translation/index';

interface IWhereObj {
  siteId: number;
  lang?: string;
}

export default async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId);
  const lang: string = ctx.query.lang || 'all';
  const page = Number(ctx.query.page) || 1;
  const limit = Number(ctx.query.pageSize) || 50;

  const whereObj: IWhereObj = { siteId };

  if (lang !== 'all') {
    whereObj.lang = lang;
  }

  const list = await translationService.list(
    {
      where: { ...whereObj },
    },
    page,
    limit,
  );

  ctx.body = { ...list, page, limit };
};
