import { Context } from 'koa';
import { authService } from '@services/auth/index';

interface ILoginBody {
  login: string;
  password: string;
}

export default async (ctx: Context) => {
  const body: ILoginBody = ctx.request.body;

  const result = await authService.login(body);

  ctx.body = { ...result };
};
