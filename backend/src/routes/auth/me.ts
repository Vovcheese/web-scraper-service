import { Context } from 'koa';

export default async (ctx: Context) => {
  ctx.body = { ...ctx.user };
};
