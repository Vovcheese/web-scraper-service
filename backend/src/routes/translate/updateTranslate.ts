import { Context } from 'koa';
import { 
  translationServiceFactory
} from '@services/index';

interface ITranslateBody {
  text: string;
}

export default async (ctx: Context) => {
  const translateId = Number(ctx.params.translateId);
  const body: ITranslateBody = ctx.request.body;

  const findTranslation = await translationServiceFactory().findOne({
    where: { id: translateId },
  });

  if (!findTranslation) {
    throw new Error('Translation not found');
  }

  if (findTranslation.default) {
    throw new Error('Default translate not editable');
  }

  findTranslation.text = body.text;

  await findTranslation.save();

  ctx.body = { ...findTranslation.toJSON() };
};
