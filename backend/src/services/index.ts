import scrape from 'website-scraper';
import config from '@config/index';
import { FileService } from '@services/domain/File/index';
import { TranslationService } from '@services/domain/Translation/index';
import { PipelineService } from '@services/domain/Pipeline/index';
import { SiteService } from '@services/domain/Site/index';
import { UserService } from '@services/domain/User/index';
import { CheerioService } from '@services/cheerio/index';
import { RenderService } from '@services/render/index';
import { AuthService } from '@services/auth/AuthService';
import { DeeplProvider, TranslaterService, TranslatteProvider} from '@services/translater/index';
import ScraperService from '@services/scraper/lib/index';
import WebScraperProvider from '@services/scraper/lib/providers/WebScraperProvider/index';
import { repos } from '@db/index';



export const scraperServiceFactory = () => {
    return new ScraperService<scrape.Options>(
        new WebScraperProvider(),
        fileServiceFactory(),
        translationServiceFactory(),
      );
}

export const translaterServiceFactory = (type: string = 'deepl') => {
    if(type === 'translatte') {
        return new TranslaterService(new TranslatteProvider())
    }
    return new TranslaterService(new DeeplProvider(config.deepl.apiKey))
}

export const cheerioServiceFactory = () => {
    return new CheerioService()
};

export const renderServiceFactory = () => {
    return new RenderService(
        siteServiceFactory(),
        translationServiceFactory(),
        fileServiceFactory()
    );
};

export const authServiceFactory = () => {
    return new AuthService(
        userServiceFactory()
    );
};

// Domain
export const fileServiceFactory = () => {
    return new FileService(
        repos.fileRepositiory,
        cheerioServiceFactory()
    );
};

export const translationServiceFactory = () => {
    return new TranslationService(repos.translationRepositiory, translaterServiceFactory())
}

export const pipelineServiceFactory = () => {
    return new PipelineService(
        repos.pipelineRepositiory,
        scraperServiceFactory(),
        translationServiceFactory()
    );
};

export const siteServiceFactory = () => {
    return new SiteService(
        repos.siteRepositiory
    );
};

export const userServiceFactory = () => {
    return new UserService(
        repos.userRepositiory
    );
};