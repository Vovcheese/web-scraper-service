const cron = require('node-cron');
const translater = require('translatte');
const { SiteText } = require('../models');

cron.schedule('*/2 * * * *', async () => {
  console.log('Cron translates started...');

  const findDefaultTexts = await SiteText.findAll({
    where: { default: false, status: 'PENDING' },
  });

  console.log(`Найдено слов: ${findDefaultTexts.length}`);

  if (findDefaultTexts && findDefaultTexts.length) {
    for (const text of findDefaultTexts) {
      const translateData = await translater(text.value, { to: text.lang });
      text.value = translateData.text;
      text.status = 'SUCCESS';
      await text.save();
      console.log(
        `${text.value}(${text.lang}) переведен ${translateData.text}`,
      );
    }
  }
});
