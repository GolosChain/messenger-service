const core = require('gls-core-service');
const stats = core.utils.statsClient;
const BasicMain = core.services.BasicMain;
const env = require('./data/env');
const Connector = require('./services/Connector');

class Main extends BasicMain {
    constructor() {
        super(stats, env);
        const connector = new Connector();
        // TODO MongoDB

        this.addNested(connector);
        this.defineMeta({ name: 'messenger' });
    }
}

module.exports = Main;
