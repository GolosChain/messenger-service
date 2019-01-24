const core = require('gls-core-service');
const stats = core.utils.statsClient;
const BasicMain = core.services.BasicMain;
const MongoDB = core.services.MongoDB;
const env = require('./data/env');
const Connector = require('./services/Connector');
const Facebook = require('./services/Facebook');
const Telegram = require('./services/Telegram');
const WeChat = require('./services/WeChat');
const WhatsApp = require('./services/WhatsApp');

class Main extends BasicMain {
    constructor() {
        super(stats, env);

        const connector = new Connector();
        const mongoDB = new MongoDB();
        const facebook = new Facebook({ connector: this });
        const telegram = new Telegram({ connector: this });
        const weChat = new WeChat({ connector: this });
        const whatsApp = new WhatsApp({ connector: this });

        this.addNested(mongoDB, facebook, telegram, weChat, whatsApp, connector);
        this.defineMeta({ name: 'messenger' });
    }
}

module.exports = Main;
