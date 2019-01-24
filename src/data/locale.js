const core = require('gls-core-service');
const Template = core.utils.Template;

// prettier-ignore
module.exports = Template.makeFor({
    registration: {
        hello: {
            ru: 'ПРИВЕТСТВИЕ НА СТАРТЕ',
            en: 'ЕН ПРИВЕТСТВИЕ НА СТАРТЕ',
        },
        resendCode: {
            ru: 'ОПОВЕЩЕНИЕ ЧТО КОД БУДЕТ ИЗМЕНЕН',
            en: 'ЕН ОПОВЕЩЕНИЕ ЧТО КОД БУДЕТ ИЗМЕНЕН',
        },
        code: {
            ru: 'Ваш код подтверждения ${code}',
            en: 'Your verification code is ${code}',
        },
    },
    support: {
        unknownCommand: {
            ru: 'ОПОВЕЩЕНИЕ О НЕИЗВЕСТНОЙ КОМАНДЕ',
            en: 'ЕН ОПОВЕЩЕНИЕ О НЕИЗВЕСТНОЙ КОМАНДЕ',
        }
    }
});
