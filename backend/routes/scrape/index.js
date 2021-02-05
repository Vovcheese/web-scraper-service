const path = require('path')
const Router = require('@koa/router');
const scrape = require('website-scraper');
const router = new Router();
const { Site, SiteText } = require('../../models')
const uuid = require('uuid');
const fs = require('fs').promises
const cheerio = require('cheerio')

router.prefix('/scrape')

const langList = ['it', 'en', 'ru']

router.post('/', async (ctx) => {
    const body = ctx.request.body

    const urls = [body.mainLink]

    if (!body.siteName) {
        body.siteName = randomId()
    }

    if (body.manyLinks && body.manyLinks.length) {
        urls.push(...body.manyLinks)
    }

    const options = {
        urls,
        directory: path.resolve(appRoot, 'views', body.siteName),
        sources: [
            { selector: 'img', attr: 'src' },
            { selector: 'link[rel="stylesheet"]', attr: 'href' },
            { selector: 'script', attr: 'src' },
        ]
    };

    await scrape(options);

    const newSite = new Site()

    newSite.name = body.siteName
    newSite.siteUrl = body.mainLink

    await newSite.save()

    try {
        await parse(path.resolve(appRoot, 'views', newSite.name, 'index.html'), newSite.id)
        newSite.statusParse = 'SUCCESS'
        await newSite.save()
    } catch (error) {
        newSite.statusParse = 'ERROR'
        newSite.errorParse = error.message
        await newSite.save()
    }

    ctx.body = { success: true, options, site: newSite }
});



const parse = async (path, siteId) => {
    console.log('Start parsing', siteId)

    const loadFile = await fs.readFile(path, 'utf-8')

    const $ = cheerio.load(loadFile)

    const childrens = $('body').children()

    result = await searchTextNode($, childrens, siteId)

    await fs.writeFile(path, result.html(), 'utf-8')
}

const searchTextNode = async ($, childrens, siteId) => {
    for (const child of childrens) {
        if (child.type === 'tag') {
            if (child.children) {
                await searchTextNode($, child.children, siteId)
            }
        } else if (child.type === 'text') {
            if (child.data.trim().length > 1) {
                const id = randomId()
                const text = child.data
                if(text.indexOf('{{') === -1 && text.indexOf('}}') === -1) {
                    const wrap = $(child).wrap('<span></span>')
                    const parent = $(wrap.parent())
                    const promises = []
                    const newSiteText = new SiteText()
                    newSiteText.siteId = siteId
                    newSiteText.key = id
                    newSiteText.value = text
                    newSiteText.default = true
                    promises.push(newSiteText.save())

                    for (const lang of langList) {
                        const newSiteText = new SiteText()
                        newSiteText.siteId = siteId
                        newSiteText.lang = lang
                        newSiteText.key = id
                        newSiteText.value = text
                        newSiteText.default = false
                        promises.push(newSiteText.save())
                    }

                    await Promise.all(promises)

                    parent.text(`{{${id}}}`)
                }
                
            }
        }
    }
    return $
}

const randomId = () => {
    return uuid.v4()
}

module.exports = router