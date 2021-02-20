import { Context, Next } from 'koa';
import { authService } from '@services/auth/index';

export default async (ctx: Context, next: Next) => {
  const authHeader = ctx.request.headers['authorization'];

  if (!authHeader) return ctx.status = 403;

  if (!authHeader.startsWith('Bearer')) return ctx.status = 403;

  const token = authHeader.split('Bearer ')[1];

  try {
    const verify = authService.verifyAccessJWT(token);

    if (!verify) return ctx.status = 403;

    ctx.user = verify;
  } catch (error) {
    return ctx.status = 403;
  }
  
  await next();
};
