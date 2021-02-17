import { Context } from 'koa';
import fileService from '@services/domain/File/index';

export default async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId);
  const page = Number(ctx.query.page) || 1;
  const limit = Number(ctx.query.pageSize) || 50;

  const list = await fileService.list(
    {
      where: { siteId, ext: '.html' },
    },
    page,
    limit,
  );

  ctx.body = { ...list, page, limit };
};
