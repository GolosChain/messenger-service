const core = require('gls-core-service');
const BasicConnector = core.services.Connector;
const env = require('../data/env');

class Connector extends BasicConnector {
    async start() {
        await super.start({
            requiredClients: {
                registration: env.GLS_REGISTRATION_CONNECT,
            },
        });
    }
}

module.exports = Connector;
