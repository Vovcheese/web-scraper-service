import { Context, Next } from 'koa';
import { authService } from '@services/auth/index';

export default async (ctx: Context, next: Next) => {
  return next();

  const authHeader = ctx.request.headers['authorization'];

  if (!authHeader) return ctx.status = 403;

  if (!authHeader.startsWith('Bearer')) return ctx.status = 403;

  const token = authHeader.split('Bearer')[1];

  const verify = authService.verifyAccessJWT(token);

  if (!verify) return ctx.status = 403;

  ctx.user = verify;

  await next();
};
