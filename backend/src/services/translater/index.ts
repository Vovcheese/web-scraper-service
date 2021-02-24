import translater from 'translatte';

export interface ITranslaterService {
    translate(text: string, lang: string): Promise<ITranslateResponse>
}

interface ITranslateResponse {
    inputText: string;
    outputText: string;
    detectLanguage?: string;
}

interface ItranslaterProvider {
    translate(text: string, lang: string): Promise<ITranslateResponse>
}

class TranslatteProvider implements ItranslaterProvider {
    constructor() {}

    async translate(text: string, lang: string) {
        const result: ITranslateResponse = { inputText: text, outputText: '' }
        const translateData = await translater(text, { to: lang });
        result.outputText = translateData.text;
        return result
    }
}

class TranslaterService implements ITranslaterService{
    constructor(private translaterProvider: ItranslaterProvider) {}

    translate(text: string, lang: string) {
        return this.translaterProvider.translate(text, lang)
    }

}

export const translaterService = new TranslaterService(new TranslatteProvider())
