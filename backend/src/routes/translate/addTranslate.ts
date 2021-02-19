import { Context } from "koa"
import translationService from "@services/domain/Translation/index"
import TranslationModel from "@models/Translation.model"

interface ITranslateBody {
  langList: string[];
}

export default async (ctx: Context) => {
  const siteId = Number(ctx.params.siteId)
  const body: ITranslateBody = ctx.request.body

  if (!body.langList.length) {
    throw new Error("Lang list is empty")
  }

  const findDefaultTranslate = await translationService.findAll({
    where: { siteId, default: true },
  })

  if (!findDefaultTranslate.length) {
    throw new Error('Default traslates not found')
  }

  const translateObject: Partial<TranslationModel>[] = []

  for (const lang of body.langList) {
    for (const defaultTranslate of findDefaultTranslate) {
      const findTranslation = await translationService.findOne({
        where: {
          siteId,
          lang,
          default: false,
          textId: defaultTranslate.textId
        },
      })

      if (findTranslation) {
        throw new Error(`Translates for lang ${lang} exist`)
      }

      translateObject.push({
        siteId,
        lang,
        text: defaultTranslate.text,
        textId: defaultTranslate.textId,
        default: false,
      })
    }
  }

  await translationService.bulkCreate(translateObject)

  ctx.body = { success: true }
}
