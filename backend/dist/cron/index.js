var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const cron = require('node-cron');
const translater = require('translatte');
const { SiteText } = require('../models');
cron.schedule('*/2 * * * *', () => __awaiter(this, void 0, void 0, function* () {
    console.log('Cron translates started...');
    const findDefaultTexts = yield SiteText.findAll({
        where: { default: false, status: 'PENDING' },
    });
    console.log(`Найдено слов: ${findDefaultTexts.length}`);
    if (findDefaultTexts && findDefaultTexts.length) {
        for (const text of findDefaultTexts) {
            const translateData = yield translater(text.value, { to: text.lang });
            text.value = translateData.text;
            text.status = 'SUCCESS';
            yield text.save();
            console.log(`${text.value}(${text.lang}) переведен ${translateData.text}`);
        }
    }
}));
