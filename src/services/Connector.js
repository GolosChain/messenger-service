const core = require('gls-core-service');
const BasicConnector = core.services.Connector;
const env = require('../data/env'); // TODO -

class Connector extends BasicConnector {
    async start() {
        await super.start({
            // TODO API
        });
    }
}

module.exports = Connector;
