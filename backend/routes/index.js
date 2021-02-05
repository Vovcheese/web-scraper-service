const Router = require('@koa/router');
const router = new Router();
const scrape = require('./scrape')
const { SiteText, Site } = require('../models')

router.get('/:name/:lang', async (ctx) => {
    const findSite = await Site.findOne({ where: { name: ctx.params.name, statusParse: 'SUCCESS' } })
    if(findSite) {
        let findTexts = await SiteText.findAll({ where: { siteId: findSite.id, lang: ctx.params.lang  } })

        if(findTexts && findTexts.length === 0) {
            findTexts = await SiteText.findAll({ where: { siteId: findSite.id, default: true  } })
        }

        if(findTexts && findTexts.length) {
            const data = findTexts.reduce((acc, i) => {

                if(!acc[i.key]) acc[i.key] = i.value
                return acc
            }, {})

            await ctx.render(`views/${ctx.params.name}/index`, data);
        }
    }
});

router.use(scrape.routes())
router.use(scrape.allowedMethods())


module.exports = router