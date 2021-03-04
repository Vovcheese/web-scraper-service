import cheerio from 'cheerio';

export interface ICheerioService {
    findTitle(html:string): cheerio.Element
    findHead(html: string): cheerio.Cheerio
    replaceHeader(html:string, mainHeader: cheerio.Cheerio): string
}


class CheerioService implements ICheerioService{
    constructor() {}

    findTitle(html:string) {
        const $ = cheerio.load(html);
        const head = $('head');
        const childrens = head.children() as unknown;
        let findTitle
        
        for (const item of Object.values(childrens)) {
            if(item.name === 'title') {
                findTitle = item
                break;
            }
        }
        return findTitle
    }

    findHead(html: string) {
        const $ = cheerio.load(html);
        const head = $('head');
        return head
    }

    replaceHeader(html:string, mainHeader: cheerio.Cheerio) {
        const $ = cheerio.load(html);
        
        const head = $('head');
        const title = head.find('title');
        const titleMainHead = mainHeader.find('title')
        
        titleMainHead.remove()

        head.empty()
        head.append(title)
        head.append(mainHeader.html())

        return $.html()
    }

}

export const cheerioService = new CheerioService()
