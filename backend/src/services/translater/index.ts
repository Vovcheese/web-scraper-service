import translater from 'translatte';
import axios from 'axios';
import config from '@config/index';
import TranslationModel from '@/db/models/Translation.model';

export interface ITranslaterService {
    translate(translation: TranslationModel): Promise<ITranslateResponse>
}

interface IDeeplResponse {
    data: {
        translations:{
            detected_source_language: string,
            text:string,
        }[]
    }
}
interface ITranslateResponse {
    inputText: string;
    outputText: string;
    translation?: TranslationModel;
    detectLanguage?: string;
}

interface ItranslaterProvider {
    translate(text: string, lang: string): Promise<ITranslateResponse>
}

export class TranslatteProvider implements ItranslaterProvider {
    constructor() {}

    async translate(text: string, lang: string) {
        const result: ITranslateResponse = { inputText: text, outputText: '' };
        const translateData = await translater( text, { to: lang } );
        result.outputText = translateData.text;
        return result
    }
}

export class DeeplProvider implements ItranslaterProvider {
    constructor(private apiKey: string) {}

    async translate(text: string, lang: string) {
        const result: ITranslateResponse = { inputText: text, outputText: '' }
        const queryBody = new URLSearchParams()

        queryBody.append('auth_key', this.apiKey)
        queryBody.append('text', text)
        queryBody.append('target_lang', lang.toUpperCase())

        const translateData: IDeeplResponse = await axios.post(`https://api.deepl.com/v2/translate?auth_key=${this.apiKey}`, queryBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        if (translateData && translateData.data.translations && translateData.data.translations.length) {
            result.outputText = translateData.data.translations[0].text;
            result.detectLanguage = translateData.data.translations[0].detected_source_language;
        }
        
        return result
    }
}

export class TranslaterService implements ITranslaterService{
    constructor(private translaterProvider: ItranslaterProvider) {}

    async translate(translation: TranslationModel) {
        const result = await this.translaterProvider.translate(translation.text, translation.lang)
        result.translation = translation
        return result
    }

}

export const translatteService = new TranslaterService(new TranslatteProvider())

export const deeplService = new TranslaterService(new DeeplProvider(config.deepl.apiKey))
