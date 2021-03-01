import siteService, { ISiteService } from "@services/domain/Site/index";
import translationService, { ITranslationService } from "@services/domain/Translation/index";
import fileService, { IFileService } from "@services/domain/File/index";

interface IRenderService {
    getRenderData(domain: string, fileName:string, lang: string): Promise<{ siteId: number, data: any }>
}

export class RenderService implements IRenderService{
    constructor(private siteService: ISiteService, private translationService: ITranslationService, private fileService: IFileService) {}

    async getRenderData(domain: string, fileName:string, lang: string) {
        let data = {};
        const findSite = await this.siteService.findOne({
            where: { domain, active: true },
        })

        if (!findSite) {
            throw new Error('Site not found');
        }
        
        const findFile = await this.fileService.findOne({ where: { fileName, siteId: findSite.id } })

        if (!findFile) {
            throw new Error('File not found');
        }

        const siteId: number = findSite.id;
        const fileId: number = findFile.id;
    
        let findTexts = await this.translationService.findAll({
            where: { lang, siteId, fileId },
        })
    
        if (findTexts && findTexts.length === 0) {
            findTexts = await this.translationService.findAll({
                where: { siteId, fileId, default: true },
            })
        }
    
        if (findTexts && findTexts.length) {
            data = findTexts.reduce((acc: any, i: any) => {
                if (!acc[i.textId]) acc[i.textId] = i.text
                return acc
            }, {})
        }

        return { siteId, data }
    }
}


export const renderService = new RenderService(siteService, translationService, fileService)