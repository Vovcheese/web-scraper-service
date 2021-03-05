import { Context } from 'koa';
import { authServiceFactory } from '@services/index';

interface ILoginBody {
  login: string;
  password: string;
}

export default async (ctx: Context) => {
  const body: ILoginBody = ctx.request.body;

  const result = await authServiceFactory().login(body);

  ctx.body = { ...result };
};
